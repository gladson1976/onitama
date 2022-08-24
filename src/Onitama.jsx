import { useCallback, useState, useEffect, useSyncExternalStore } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { onitamaPacks } from './onitama.cards';
import './Onitama.scss';

function Onitama() {
	const appTitle = 'Onitama';
	const appVersion = '1.0';
	const hintCount = 0;
	const [deviceOrientation, setDeviceOrientation] = useState('portrait');
	const [selectedPacks, setSelectedPacks] = useState([1]); // Array of selected packs (Onitama, Sensei's Path, Way of the Wind). Onitama is always selected.
	const [currentCardSet, setCurrentCardSet] = useState([]);
	const [currentHand, setCurrentHand] = useState([]); // 5 element array of cards [0, 1] -> Player, [2] -> Extra, [3, 4] -> Automaton.
	const [spareCardHolder, setSpareCardHolder] = useState('human');

	const getRandom = useCallback((min, max) => {
		return Math.floor(Math.random()*(max-min+1))+min;
	}, []);

	const findDeviceOrientation = useCallback(() => {
		const { innerWidth: width, innerHeight: height } = window;
		if (width > height) {
			setDeviceOrientation('landscape');
		} else {
			setDeviceOrientation('portrait');
		}
	}, []);

	const collectCurrentCardSet = useCallback(() => {
		const collectedCards = _.compact(_.map(onitamaPacks, (pack) => {
			return selectedPacks.includes(pack.id) ? pack.cards : null;
		}));
		setCurrentCardSet(collectedCards[0]);
	}, [selectedPacks]);

	const goHint = useCallback(() => {
		console.log('Hint');
	}, []);

	const newOnitama = useCallback(() => {
		const tempSet = Object.assign([], currentCardSet);
		let tempHand = [];
		const dealOrder = [0, 1, 3, 4, 2];
		_.map(dealOrder, (order) => {
			const randomCard = getRandom(0, tempSet.length - 1);
			tempHand[order] = tempSet[randomCard];
			tempSet.splice(randomCard, 1);
		});
		setCurrentHand(tempHand);
		const tempSpareHolder = tempHand[2].rank === 'red' ? 'human' : 'auto';
		setSpareCardHolder(tempSpareHolder);
	}, [currentCardSet, getRandom]);

	const showSettings = useCallback(() => {
		console.log('Settings');
	}, []);

	const showStats = useCallback(() => {
		console.log('Stats');
	}, []);

	const showHelp = useCallback(() => {
		console.log('Help - ', appTitle, appVersion);
	}, []);

	const renderOnitamaHeader = useCallback(() => {
		return (
			<div className="onitama-title title-border">
				<table className="onitama-title">
					<tbody>
						<tr>
							<td className="title">
								<span>{appTitle}</span>
							</td>
							<td className="title text-right">
								<span className={classNames('material-icons', 'icon icon-hint', 'title-button', 'cursor-pointer', { 'hidden': hintCount === 0 })} onClick={() => goHint()} />
								<span className="material-icons icon icon-replay title-button cursor-pointer" onClick={() => newOnitama()} />
								<span className="material-icons icon icon-settings title-button cursor-pointer" onClick={() => showSettings()} />
								<span className="material-icons icon icon-bar-chart title-button cursor-pointer" onClick={() => showStats()} />
								<span className="material-icons icon icon-question title-button cursor-pointer" onClick={() => showHelp()} />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}, [goHint, hintCount, newOnitama, showHelp, showSettings, showStats]);

	const renderCells = useCallback((card) => {
		const cardMoveColor = `onitama-cell-${card.color}`;

		return _.map(Array(25), (value, index) => {
			return (
				<div className={classNames('onitama-card-cell', { [cardMoveColor]: card.moves.includes(index), 'onitama-cell-player': index === 12 })}></div>
			);
		});
	}, []);

	const renderCard = useCallback((card, isSpareCard = false) => {
		return (
			<>
				<div className={classNames('onitama-card', { 'onitama-spare-card': isSpareCard })}>
					<div id="onitamaCardHeader" className="onitama-card-header">
						<span>{card.name}</span> <span>{card.glyph}</span>
					</div>
					<div id="onitamaCardBody" className="onitama-card-body">
						{renderCells(card)}
					</div>
				</div>
			</>
		);
	}, [renderCells]);

	const renderCards = useCallback((player) => {
		const selectedCards = player === 'human' ? [0, 1] : [3, 4];
		if (currentHand.length === 0) {
			return;
		}
		return _.map(selectedCards, (card) => {
			return renderCard(currentHand[card]);
		});
	}, [currentHand, renderCard]);

	const renderSpareCard = useCallback((player) => {
		if (currentHand.length === 0) {
			return;
		}
		if (spareCardHolder === player) {
			return renderCard(currentHand[2], true);
		}
		return null;
	}, [currentHand, renderCard, spareCardHolder]);

	const renderOnitamaBoard = useCallback(() => {
		return (
			<>
				<div id='onitamaContainer' className='onitama-container'>
					<div id="onitamaAutomatonContainer" className="onitama-player-container onitama-rotate-card onitama-player-color-blue">
						<div id="onitamaAutomaton" className="onitama-player">
							{renderCards('auto')}
						</div>
						<div id="onitamaSpareAutomaton" className="onitama-spare">
							{renderSpareCard('auto')}
						</div>
					</div>
					<div id="onitamaBoard" className="onitama-grid">
						<div className="onitama-cell onitama-student-blue"></div>
						<div className="onitama-cell onitama-student-blue"></div>
						<div className="onitama-cell onitama-dragon-blue"></div>
						<div className="onitama-cell onitama-student-blue"></div>
						<div className="onitama-cell onitama-student-blue"></div>
						<div className="onitama-cell"></div>
						<div className="onitama-cell"></div>
						<div className="onitama-cell"></div>
						<div className="onitama-cell"></div>
						<div className="onitama-cell"></div>
						<div className="onitama-cell"></div>
						<div className="onitama-cell"></div>
						<div className="onitama-cell"></div>
						<div className="onitama-cell"></div>
						<div className="onitama-cell"></div>
						<div className="onitama-cell"></div>
						<div className="onitama-cell"></div>
						<div className="onitama-cell"></div>
						<div className="onitama-cell"></div>
						<div className="onitama-cell"></div>
						<div className="onitama-cell onitama-student-red"></div>
						<div className="onitama-cell onitama-student-red"></div>
						<div className="onitama-cell onitama-dragon-red"></div>
						<div className="onitama-cell onitama-student-red"></div>
						<div className="onitama-cell onitama-student-red"></div>
					</div>
					<div id="onitamaPlayerContainer" className="onitama-player-container onitama-player-color-red">
						<div id="onitamaHuman" className="onitama-player">
							{renderCards('human')}
						</div>
						<div id="onitamaSpareHuman" className="onitama-spare">
							{renderSpareCard('human')}
						</div>
					</div>
				</div>
			</>
		);
	}, [renderCards]);

	useEffect(() => {
		setSelectedPacks([1]);
		collectCurrentCardSet();

		findDeviceOrientation();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{renderOnitamaHeader()}
			{renderOnitamaBoard()}
		</>
	);
}

export default Onitama;

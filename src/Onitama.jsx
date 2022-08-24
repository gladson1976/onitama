import { useCallback, useState, useEffect } from 'react';
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
	const [currentBoard, setCurrentBoard] = useState(Array(25));
	const [currentHand, setCurrentHand] = useState([]); // 5 element array of cards [0, 1] -> Player, [2] -> Extra, [3, 4] -> Automaton.
	const [spareCardHolder, setSpareCardHolder] = useState('human');
	const [selectedPiece, setSelectedPiece] = useState(-1);
	const [selectedCard, setSelectedCard] = useState(-1);

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

	const clearOnitamaBoard = useCallback(() => {
		let tempBoard = Object.assign([], currentBoard);
		_.map(tempBoard, (value, index) => {
			tempBoard[index] = 0;
		});
		setCurrentBoard(tempBoard);
	}, [currentBoard]);

	const initOnitamaBoard = useCallback(() => {
		let tempBoard = Object.assign([], currentBoard);
		tempBoard[0] = 1;
		tempBoard[1] = 1;
		tempBoard[2] = 10;
		tempBoard[3] = 1;
		tempBoard[4] = 1;

		tempBoard[20] = 2;
		tempBoard[21] = 2;
		tempBoard[22] = 20;
		tempBoard[23] = 2;
		tempBoard[24] = 2;

		setCurrentBoard(tempBoard);
	}, [currentBoard]);

	const goHint = useCallback(() => {
		console.log('Hint');
	}, []);

	const newOnitama = useCallback(() => {
		clearOnitamaBoard();
		initOnitamaBoard();
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
	}, [clearOnitamaBoard, currentCardSet, getRandom, initOnitamaBoard]);

	const showSettings = useCallback(() => {
		console.log('Settings');
	}, []);

	const showStats = useCallback(() => {
		console.log('Stats');
	}, []);

	const showHelp = useCallback(() => {
		console.log('Help - ', appTitle, appVersion);
	}, []);

	const checkCellClick = useCallback((cellIndex) => {
		// If index is a valid selectable piece (2 or 20) and set it as the selected piece
		// If same piece is selected again, deselect it
		// If piece is already selected and index is a valid move position, then proceed to move action
		if (currentBoard[cellIndex] === 2 || currentBoard[cellIndex] === 20) {
			if (selectedPiece === cellIndex) {
				setSelectedPiece(-1);
				return;
			}
			setSelectedPiece(cellIndex);
		}
	}, [currentBoard, selectedPiece]);

	const renderOnitamaHeader = useCallback(() => {
		return (
			<div key='onitamaHeader' className="onitama-title title-border">
				<table key='onitamaTitleTable' className="onitama-title">
					<tbody key='onitamaTitleBody'>
						<tr key='onitamaTitleTRTitle'>
							<td key='onitamaTitleTDTitle' className="title">
								<span>{appTitle}</span>
							</td>
							<td key='onitamaTitleTDIcons' className="title text-right">
								<span key='onitamaTitleHint' className={classNames('material-icons', 'icon icon-hint', 'title-button', 'cursor-pointer', { 'hidden': hintCount === 0 })} onClick={() => goHint()} />
								<span key='onitamaTitleNew' className="material-icons icon icon-replay title-button cursor-pointer" onClick={() => newOnitama()} />
								<span key='onitamaTitleSettings' className="material-icons icon icon-settings title-button cursor-pointer" onClick={() => showSettings()} />
								<span key='onitamaTitleStats' className="material-icons icon icon-bar-chart title-button cursor-pointer" onClick={() => showStats()} />
								<span key='onitamaTitleHelp' className="material-icons icon icon-question title-button cursor-pointer" onClick={() => showHelp()} />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}, [goHint, hintCount, newOnitama, showHelp, showSettings, showStats]);

	const renderOnitamaBoard = useCallback(() => {
		return (
			<div key='onitamaBoard' id="onitamaBoard" className="onitama-grid">
				{
					_.map(currentBoard, (value, index) => {
						return (
							<div key={`boardcell${index}`} className={classNames('onitama-cell', {
								'onitama-student-blue': value === 1,
								'onitama-dragon-blue': value === 10,
								'onitama-student-red': value === 2,
								'onitama-dragon-red': value === 20,
								'onitama-cell-selected': index === selectedPiece
							})}
							onClick={() => { checkCellClick(index); }}></div>
						);
					})
				}
			</div>
		);
	}, [checkCellClick, currentBoard, selectedPiece]);

	const renderCells = useCallback((card) => {
		const cardMoveColor = `onitama-cell-${card.color}`;

		return _.map(currentBoard, (value, index) => {
			return (
				<div key={`cardcell${index}`} className={classNames('onitama-card-cell', {
					[cardMoveColor]: card.moves.includes(index), 'onitama-cell-player': index === 12
				})}></div>
			);
		});
	}, [currentBoard]);

	const renderCard = useCallback((card, isSpareCard = false) => {
		return (
			<>
				<div key={card.name} className={classNames('onitama-card', {
					'onitama-spare-card': isSpareCard,
					'onitama-card-color-blue': card.rank === 'blue',
					'onitama-card-color-red': card.rank === 'red'
				})}>
					<div key={`onitamaCardHeader-${card.name}`} id="onitamaCardHeader" className="onitama-card-header">
						<span>{card.name}</span> <span>{card.glyph}</span>
					</div>
					<div key={`onitamaCardBody-${card.name}`} id="onitamaCardBody" className="onitama-card-body">
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

	const renderOnitamaBody = useCallback(() => {
		return (
			<>
				<div key='onitamaContainer' id='onitamaContainer' className='onitama-container'>
					<div key='onitamaAutomatonContainer' id="onitamaAutomatonContainer" className="onitama-player-container onitama-rotate-card onitama-player-color-blue">
						<div key='onitamaAutomaton' id="onitamaAutomaton" className="onitama-player">
							{renderCards('auto')}
						</div>
						<div key='onitamaSpareAutomaton' id="onitamaSpareAutomaton" className="onitama-spare">
							{renderSpareCard('auto')}
						</div>
					</div>
					{renderOnitamaBoard()}
					<div key='onitamaPlayerContainer' id="onitamaPlayerContainer" className="onitama-player-container onitama-player-color-red">
						<div key='onitamaHuman' id="onitamaHuman" className="onitama-player">
							{renderCards('human')}
						</div>
						<div key='onitamaSpareHuman' id="onitamaSpareHuman" className="onitama-spare">
							{renderSpareCard('human')}
						</div>
					</div>
				</div>
			</>
		);
	}, [renderCards, renderOnitamaBoard, renderSpareCard]);

	useEffect(() => {
		setSelectedPacks([1]);
		collectCurrentCardSet();

		findDeviceOrientation();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{renderOnitamaHeader()}
			{renderOnitamaBody()}
		</>
	);
}

export default Onitama;

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
	const [possibleBoard, setPossibleBoard] = useState(Array(25));
	const [currentHand, setCurrentHand] = useState([]); // 5 element array of cards [0, 1] -> Player, [2] -> Extra, [3, 4] -> Automaton.
	const [spareCardHolder, setSpareCardHolder] = useState('human');
	const [selectedPiece, setSelectedPiece] = useState(-1);
	const [selectedCard, setSelectedCard] = useState(-1);
	const [selectedCardIndex, setSelectedCardIndex] = useState(-1);
	const [showAnimatedSpare, setShowAnimatedSpare] = useState(false);
	const [isGameOver, setIsGameOver] = useState(false);
	const [onitamaMessage, setOnitamaMessage] = useState({});

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
		let tempBoard = _.fill(Array(25), 0);
		setCurrentBoard(tempBoard);
		setShowAnimatedSpare(true);
	}, []);

	const clearPossibleMoves = useCallback(() => {
		let tempBoard = _.fill(Array(25), 0);
		setPossibleBoard(tempBoard);
	}, []);

	const initOnitamaBoard = useCallback(() => {
		let tempBoard = _.fill(Array(25), 0);
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
		clearPossibleMoves();
		setSelectedPiece(-1);
		setSelectedCard(-1);
		setSelectedCardIndex(-1);
		setIsGameOver(false);
		setOnitamaMessage({});
	}, [clearPossibleMoves]);

	const goHint = useCallback(() => {
		console.log('Hint');
	}, []);

	const newOnitama = useCallback(() => {
		clearOnitamaBoard();
		initOnitamaBoard();
		const tempSet = _.cloneDeep(currentCardSet);
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

	const showOnitamaSplash = useCallback(() => {
		return (
			<div id='onitamaWinner' className={classNames('onitama-win-splash', {
				'onitama-win-blue': onitamaMessage.winner === 'auto',
				'onitama-win-red': onitamaMessage.winner === 'human',
				'show-onitama-win-splash': isGameOver
			})}>
				{onitamaMessage.message}
			</div>
		);
	}, [isGameOver, onitamaMessage]);

	const checkOnitama = useCallback(() => {
		if (_.compact(currentBoard).length === 0) {
			return;
		}
		const isAutomatonStoned = !_.find(currentBoard, (cell) => { return cell === 10; });
		const isPlayerStoned = !_.find(currentBoard, (cell) => { return cell === 20; });
		const isAutomatonStreamed = currentBoard[2] === 20;
		const isPlayerStreamed = currentBoard[22] === 10;
		if (isAutomatonStoned) {
			setOnitamaMessage({winner: 'human', message: 'Way of the Stone'});
		} else if (isPlayerStoned) {
			setOnitamaMessage({winner: 'auto', message: 'Way of the Stone'});
		} else if (isAutomatonStreamed) {
			setOnitamaMessage({winner: 'human', message: 'Way of the Stream'});
		} else if (isPlayerStreamed) {
			setOnitamaMessage({winner: 'auto', message: 'Way of the Stream'});
		}
		setIsGameOver(isAutomatonStoned || isPlayerStoned || isAutomatonStreamed || isPlayerStreamed);
	}, [currentBoard]);

	const computePossibleMoves = useCallback(() => {
		if (selectedCard === -1 || selectedPiece === -1) {
			clearPossibleMoves();
			return;
		}
		const tempSelectedCard = _.find(currentCardSet, (card) => { return card.id === selectedCard; });
		let tempBoard = _.fill(Array(25), 0);
		_.map(tempSelectedCard.moves, (move) => {
			const moveDirection = move % 5 < 2 ? 'left' : move % 5 > 2 ? 'right' : 'middle';
			const tempMove = selectedPiece + (move - 12);
			const tempDirection = tempMove % 5 < (selectedPiece % 5) ? 'left' : tempMove % 5 > (selectedPiece % 5) ? 'right' : 'middle';
			if (
				(tempMove > -1 && tempMove < 25) &&
				(currentBoard[tempMove] !== 2 && currentBoard[tempMove] !== 20) &&
				moveDirection === tempDirection
			) {
				tempBoard[tempMove] = 30;
			}
		});
		setPossibleBoard(tempBoard);
	}, [clearPossibleMoves, currentBoard, currentCardSet, selectedCard, selectedPiece]);

	const switchSpareCard = useCallback((selectedCardIndex) => {
		let tempHand = _.cloneDeep(currentHand);
		const tempSpare = tempHand[2];
		tempHand[2] = tempHand[selectedCardIndex];
		tempHand[selectedCardIndex] = tempSpare;
		setSelectedCard(-1);
		setSelectedCardIndex(-1);
		setCurrentHand(tempHand);
		setSpareCardHolder(spareCardHolder === 'auto' ? 'human' : 'auto');
	}, [currentHand, spareCardHolder]);

	const checkCellMove = useCallback((cellIndex) => {
		const validJumpTargets = [0, 1, 10];
		let tempBoard = _.cloneDeep(currentBoard);
		if (validJumpTargets.includes(tempBoard[cellIndex]) && possibleBoard[cellIndex] === 30) {
			tempBoard[cellIndex] = tempBoard[selectedPiece];
			tempBoard[selectedPiece] = 0;
			switchSpareCard(selectedCardIndex);
			setSelectedPiece(-1);
		}
		setCurrentBoard(tempBoard);
	}, [currentBoard, possibleBoard, selectedCardIndex, selectedPiece, switchSpareCard]);

	const checkCellClick = useCallback((cellIndex) => {
		// If index is a valid selectable piece (2 or 20) and set it as the selected piece
		// If same piece is selected again, deselect it
		// If piece is already selected and index is a valid move position, then proceed to move action
		if (currentBoard[cellIndex] === 2 || currentBoard[cellIndex] === 20) {
			setSelectedPiece(selectedPiece === cellIndex ? -1 : cellIndex);
		} else {
			checkCellMove(cellIndex);
		}
	}, [checkCellMove, currentBoard, selectedPiece]);

	const checkCardClick = useCallback((selCard, handIndex) => {
		setSelectedCard(selectedCard === selCard.id ? -1 : selCard.id);
		setSelectedCardIndex(selectedCard === selCard.id ? -1 : handIndex);
	}, [selectedCard]);
	
	const checkIfKillMoveAvailable = useCallback((automatonWeightages) => {
		return _.compact(_.map(automatonWeightages, (move) => {
			const kills = _.compact(_.map(move.possibles, (possible, index) => {
				if (possible === 40) {
					return index;
				}
			}));
			return kills.length > 0 ? {card: move.card, piece: move.piece, kill: kills} : null;
		}));
	}, []);

	const checkIfNonKillMoveAvailable = useCallback((automatonWeightages) => {
		return _.compact(_.map(automatonWeightages, (move) => {
			const moves = _.compact(_.map(move.possibles, (possible, index) => {
				if (possible === 30) {
					return index;
				}
			}));
			return moves.length > 0 ? {card: move.card, piece: move.piece, move: moves} : null;
		}));
	}, []);

	const makeKillMove = useCallback((automatonWeightages, killMove) => {
		console.log('Kill', killMove);
	}, []);

	const makeNonKillMove = useCallback((nonKillMove) => {
		const moveCard = nonKillMove.card;
		const moveCardIndex = _.findIndex(currentHand, (card) => { return card === moveCard; });
		console.log('Non Kill', nonKillMove);

		let tempBoard = _.cloneDeep(currentBoard);
		tempBoard[nonKillMove.piece.position] = 0;
		tempBoard[nonKillMove.move[0]] = nonKillMove.piece.piece;
		setCurrentBoard(tempBoard);

		// TODO: Make non kill move
		setSelectedCardIndex(moveCardIndex);
		switchSpareCard(moveCardIndex);
	}, [currentBoard, currentHand, switchSpareCard]);

	const decideAutomatonMove = useCallback((automatonWeightages) => {
		console.log(automatonWeightages);
		const killMoves = checkIfKillMoveAvailable(automatonWeightages);
		if (killMoves.length > 0) {
			// Do kill move
			const randomMove = getRandom(0, killMoves.length);
			makeKillMove(automatonWeightages, randomMove);
		} else {
			// Do normal move
			const nonKillMoves = checkIfNonKillMoveAvailable(automatonWeightages);
			const randomMove = getRandom(0, nonKillMoves.length - 1);
			console.log('Decide', nonKillMoves, randomMove);
			makeNonKillMove(nonKillMoves[randomMove]);
		}
	}, [checkIfKillMoveAvailable, checkIfNonKillMoveAvailable, getRandom, makeKillMove, makeNonKillMove]);

	const computeAutomatonWeightage = useCallback((card, selectedPiece) => {
		const tempSelectedCard = _.cloneDeep(card);
		let tempBoard = _.fill(Array(25), 0);
		_.map(tempSelectedCard.moves, (move) => {
			const moveDirection = move % 5 < 2 ? 'left' : move % 5 > 2 ? 'right' : 'middle';
			const tempMove = selectedPiece.position + (12 - move);
			const tempDirection = tempMove % 5 < (selectedPiece.position % 5) ? 'right' : tempMove % 5 > (selectedPiece.position % 5) ? 'left' : 'middle';
			if (
				(tempMove > -1 && tempMove < 25) &&
				(currentBoard[tempMove] !== 1 && currentBoard[tempMove] !== 10) &&
				moveDirection === tempDirection
			) {
				tempBoard[tempMove] = currentBoard[tempMove] === 0
					? 30
					: currentBoard[tempMove] === 2 || currentBoard[tempMove] === 20
						? 40
						: 0;
			}
		});
		return tempBoard;
	}, [currentBoard]);

	const computeAutomatonPossibleMoves = useCallback((card, autoPositions) => {
		return _.map(autoPositions, (piece) => {
			return {card: card, piece:piece, possibles: computeAutomatonWeightage(card, piece)};
		});
	}, [computeAutomatonWeightage]);

	const computeAutomatonMove = useCallback(() => {
		console.log('Automaton Move');
		const selectedCardPositions = [3, 4];
		const selectedCards = _.filter(currentHand, (card, index) => {
			return selectedCardPositions.includes(index);
		});
		const currentPiecePositions = _.compact(_.map(currentBoard, (cell, index) => {
			return cell !== 0 ? {position: index, piece: cell, weight: 0} : null;
		}));
		const autoPositions = _.compact(_.filter(currentPiecePositions, (value) => {
			return value.piece === 1 || value.piece === 10 ? value : null;
		}));
		if (currentHand.length === 0) {
			return;
		}
		const automatonWeightages = _.flatten(_.map(selectedCards, (card) => {
			return computeAutomatonPossibleMoves(card, autoPositions);
		}));
		decideAutomatonMove(automatonWeightages);
	}, [computeAutomatonPossibleMoves, currentBoard, currentHand, decideAutomatonMove]);

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
								'onitama-cell-selected': index === selectedPiece,
								'onitama-dragon-red-possible': possibleBoard[index] === 30 && currentBoard[selectedPiece] === 20,
								'onitama-student-red-possible': possibleBoard[index] === 30 && currentBoard[selectedPiece] === 2
							})}
							onClick={() => { checkCellClick(index); }}></div>
						);
					})
				}
			</div>
		);
	}, [checkCellClick, currentBoard, possibleBoard, selectedPiece]);

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

	const renderCard = useCallback((card, isSpareCard = false, player = '', handIndex = -1) => {
		if (!card) {
			return;
		}
		if (showAnimatedSpare) {
			window.setTimeout(() => { setShowAnimatedSpare(false); }, 2000);
		}
		return (
			<>
				<div key={card.name} className={classNames({
					'onitama-card': !isSpareCard,
					'onitama-spare-card': isSpareCard,
					'onitama-card-color-blue': card.rank === 'blue',
					'onitama-card-color-red': card.rank === 'red',
					'onitama-card-selected': card.id === selectedCard
				})}
				onClick={() => { player === 'human' && !isSpareCard ? checkCardClick(card, handIndex) : null; }}>
					<div key={`onitamaCardHeader-${card.name}`} id="onitamaCardHeader" className="onitama-card-header">
						<span>{card.name}</span> <span>{card.glyph}</span>
					</div>
					<div key={`onitamaCardBody-${card.name}`} id="onitamaCardBody" className="onitama-card-body">
						{renderCells(card)}
					</div>
				</div>
			</>
		);
	}, [checkCardClick, renderCells, selectedCard, showAnimatedSpare]);

	const renderCards = useCallback((player) => {
		const selectedCards = player === 'human' ? [0, 1] : [3, 4];
		if (currentHand.length === 0) {
			return;
		}
		return _.map(selectedCards, (card) => {
			return renderCard(currentHand[card], false, player, card);
		});
	}, [currentHand, renderCard]);

	const renderAnimatedSpare = useCallback(() => {
		return (
			<div className={classNames({'onitama-spare-card-animated-hidden': !showAnimatedSpare, 'onitama-spare-card-animated': showAnimatedSpare})}>
				<div className={classNames({
					'onitama-spare-card-flip': showAnimatedSpare,
					'onitama-spare-animate': showAnimatedSpare
				})}>
					<div className='onitama-spare-card-flip-front'>
						{renderCard(currentHand[2], true)}
					</div>
					<div className='onitama-spare-card-flip-back'></div>
				</div>
			</div>
		);
	}, [currentHand, renderCard, showAnimatedSpare]);

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
					{showOnitamaSplash()}
					{renderAnimatedSpare()}
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
	}, [renderAnimatedSpare, renderCards, renderOnitamaBoard, renderSpareCard, showOnitamaSplash]);

	// useEffect(() => {
	// 	if (showAnimatedSpare) {
	// 		setCurrentHand([]);
	// 	}
	// }, [showAnimatedSpare]);

	useEffect(() => {
		checkOnitama();
	}, [checkOnitama]);

	useEffect(() => {
		if (spareCardHolder === 'auto') {
			computeAutomatonMove();
		}
	}, [computeAutomatonMove, spareCardHolder]);

	useEffect(() => {
		computePossibleMoves();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCard, selectedPiece]);

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

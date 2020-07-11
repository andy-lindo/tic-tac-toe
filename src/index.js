import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

function Square(props) {
	return (
		<button 
			className={props.active ? "win square" : "square"} 
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		let active;
		if (this.props.winners) {
			active = this.props.winners.includes(i);
		}
		return (
			<Square 
				active={active}
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)} 
			/>
		);
	}

	render() {


		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			stepNumber: 0,
			xIsNext: true,
			descending: true,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) ==0,
		});
	}

	flipList() {
		this.setState({
			descending: !this.state.descending,
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winners = calculateWinner(current.squares);
		const losers = Array.from(current['squares']).filter((el) => el===null).length === 0;

		const order = this.state.descending ? "Descending" : "Ascending";
		const moves = history.map((step, move) => {
			if (!this.state.descending) {
				move = history.length - move - 1; 
			}
			const move_number = move ?
				'Go to move #' + move :
				'Go to game start';
			const active = this.state.stepNumber===move;

			return (
				<li key={move}>
					<button 
						className={active ? "active button": "button"}
						onClick={() => this.jumpTo(move)}>
							{move_number}
					</button>
				</li>
			);
		});
		var start_value = "0";
		if (!this.state.descending) {
			start_value = (history.length - 1).toString();
		}
		console.log(start_value);

		let status;
		if (winners) {
			const winner = current.squares[winners[0]];
			status = 'Winner: ' + winner;
		} else if (losers) {
			status = 'You both lose';

		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}


		return (
			<div className="game">
			<div className="game-board">
				<Board
					squares={current.squares}
					winners={winners}
					onClick={(i) => this.handleClick(i)}
				/>
			</div>
			<div className="game-info">
				<div>{status}</div>
				<button onClick={() => this.flipList()}> 
					{order}
				</button>
				{this.state.descending? 
					<ol start={start_value}>{moves}</ol> : 
					<ol reversed start={start_value}>{moves}</ol>}
			</div>
		</div>
	);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
	);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a , b, c];
    }
  }
  return null;
}


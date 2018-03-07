/*
* This is the React implemantation of Conway's Game of Life.
* 
*/
import React from 'react';
import ReactDOM from 'react-dom';
import{ButtonToolbar, MenuItem, DropdownButton} from 'react-bootstrap';
import './index.css';

// Represent each box in the grid 
class Box extends React.Component{
    selectBox = ()=>{
        this.props.selectBox(this.props.row, this.props.col);
    }

    render() {
        return(
            <div
                className= {this.props.boxClass}
                id = {this.props.id}
                onClick ={this.selectBox}
            />
        )
    }
}

// Grid contains boxes and we can cange gird size 
class Grid extends React.Component {
    render(){
        const width = this.props.cols * 14;
        var rowsArr = [];

        var boxClass = "";
        for(var i = 0; i < this.props.rows; i++){
            for(var j = 0; j < this.props.cols; j++){
                let boxId = i + " " + j;
                boxClass = this.props.gridFull[i][j] ? "box on": "box off";
                rowsArr.push(
                    <Box
                        boxClass = {boxClass}
                        key = {boxId}
                        boxId = {boxId}
                        row = {i}
                        col = {j}
                        selectBox = {this.props.selectBox}/>
                )
            }
        }
        return(
            <div className="grid" style={{width: width}}>
                {rowsArr}
            </div>
        )
    }
}

// Upeer buttons containing Play, Pause, Clear, slow, fast and seed buttons.
class Buttons extends React.Component{
    handleSelect =(evt) => {
      this.props.gridSize(evt);  
    }
    render(){
        return(
            <div className="center">
				<ButtonToolbar>
					<button className="btn btn-default" onClick={this.props.playButton}>
						Play
					</button>
					<button className="btn btn-default" onClick={this.props.pauseButton}>
					  Pause
					</button>
					<button className="btn btn-default" onClick={this.props.clear}>
					  Clear
					</button>
					<button className="btn btn-default" onClick={this.props.slow}>
					  Slow
					</button>
					<button className="btn btn-default" onClick={this.props.fast}>
					  Fast
					</button>
					<button className="btn btn-default" onClick={this.props.seed}>
					  Seed
					</button>
                    {/* Droopdown menu to select 3 grid options*/}
					<DropdownButton
						title="Grid Size"
						id="size-menu"
						onSelect={this.handleSelect}
					>
						<MenuItem eventKey="1">20x10</MenuItem>
						<MenuItem eventKey="2">50x30</MenuItem>
						<MenuItem eventKey="3">70x50</MenuItem>
					</DropdownButton>
				</ButtonToolbar>
			</div>
        )
    }
}

// This is the main component containing the hole application 
class Main extends React.Component{
    constructor(){
        super();
        // Default values 
        this.speed = 100;
        this.rows = 30;
        this.cols = 50;
        this.state = {
            generation: 0,
            gridFull : Array(this.rows).fill().map(()=> Array(this.cols).fill(false)),
        }
    }

    // for selecting the box when the user clicks on a box in the gird
    selectBox = (row,col)=>{
        
        let gridCopy = arrayClone(this.state.gridFull);
        gridCopy[row][col] = !gridCopy[row][col];
        this.setState({
            gridFull: gridCopy
        })
    }

    // This function seeds the grid with 25% chance of getting on in the grid 
    seed = () => {
        
        let gridCopy = arrayClone(this.state.gridFull);
        for(let i = 0; i< this.rows; i++){
            for(let j = 0; j< this.cols; j++){
                if(Math.floor(Math.random() * 4) === 1){
                    gridCopy[i][j] = true;
                }
            }
        }
        this.setState({
            gridFull: gridCopy
        });
    }

    //This function starts the game 
    playButton = () => {
        clearInterval(this.intervelId);
        this.intervelId = setInterval(this.play,this.speed);
    }

    // Pause the game 
    pauseButton = ()=>{
        clearInterval(this.intervelId);
    }

    /* Play function starts the mommentam in the game 
     * RULES:
     * Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
     * Any live cell with two or three live neighbours lives on to the next generation.
     * Any live cell with more than three live neighbours dies, as if by overpopulation.
     * Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    */
    play = () => {

        let g = this.state.gridFull;
        let g2 = arrayClone(this.state.gridFull);
      
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            let count = 0;
            if (i > 0) if (g[i - 1][j]) count++;
            if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
            if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
            if (j < this.cols - 1) if (g[i][j + 1]) count++;
            if (j > 0) if (g[i][j - 1]) count++;
            if (i < this.rows - 1) if (g[i + 1][j]) count++;
            if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
            if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;
            if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
            if (!g[i][j] && count === 3) g2[i][j] = true;
          }
        }
        this.setState({
          gridFull: g2,
          generation: this.state.generation + 1
        });
      
      }
    // Pauses the game
    pauseButton = () => {
		clearInterval(this.intervalId);
	}

    // Slows the game
	slow = () => {
		this.speed = 1000;
		this.playButton();
	}

    // Make the game moves faster 
	fast = () => {
		this.speed = 100;
		this.playButton();
	}

    // Clears the all cells in the bord
	clear = () => {
        var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        this.pauseButton()
		this.setState({
			gridFull: grid,
			generation: 0
		});
	}

    // For changing grid size
	gridSize = (size) => {
		switch (size) {
			case "1":
				this.cols = 20;
				this.rows = 10;
			break;
			case "2":
				this.cols = 50;
				this.rows = 30;
			break;
			default:
				this.cols = 70;
				this.rows = 50;
		}
        this.clear();
        this.playButton();
        
    }
    
    // Starts the game immediatly when the browser loads the app
    componentDidMount(){
        this.seed();
        this.playButton();
    }
    render(){
        return(
            <div>
                <h1>The Game of Life</h1>
                {/* Button Component */}
                <Buttons
                    playButton ={this.playButton}
                    pauseButton = {this.pauseButton}
                    slow = {this.slow}
                    fast = {this.fast}
                    clear = {this.clear}
                    seed = {this.seed}
                    gridSize = {this.gridSize}
                />
                {/* Grid Component */}
                <Grid
                    gridFull = {this.state.gridFull}
                    rows = {this.rows}
                    cols = {this.cols}
                    selectBox ={this.selectBox}
                />
                <h2>Generation: {this.state.generation}</h2>
            </div>
        );
    };
};

// To clone the cell array
function arrayClone(arr){
    return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(<Main />, document.getElementById('root'));


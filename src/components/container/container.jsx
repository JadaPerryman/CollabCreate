import React from 'react';
import Board from '../board/board';
import Save from '../save/save';
import './style.css';
import collabLogo from '../container/collabCreateLogo.png';

class Container extends React.Component
{
    //Constructor to set the default for each function
    
    constructor(props){
        super(props);

        this.state = {
            color: "#000000",
            size: "5",
            tool: "Chalk"
        }
    }

    changeColor(params) {
        this.setState({
            color: params.target.value
        })

    }

    changeSize(params) {
        this.setState({
            size: params.target.value
        })
    }

    changeTool(params) {
        this.setState({
            tool: params.target.value
        })
    }

    render() {
        return (
            //Establishes the UI for the website
            <div className="container">
                <div>
                    <img className = "CLogo" src={collabLogo} alt = "Collab Create Logo" />
                </div>
            
                <div class="tools-section">
                    <div className="color-picker-container">
                        Select Brush Color : &nbsp;
                        <input type="color" value = {this.state.color} onChange={this.changeColor.bind(this)}/>
                    </div>

                    <div className="brushsize-container"> //Different sizes for the brush
                    Select Brush Size : &nbsp;
                        <select value ={this.state.size} onChange={this.changeSize.bind(this)}>
                            <option> 5 </option>
                            <option> 10 </option>
                            <option> 15 </option>
                            <option> 20 </option>
                            <option> 25 </option>
                            <option> 30 </option>
                        </select>
                    </div>

                    <div className="tool-container">
                    Select Tool : &nbsp;
                        <select id = "tool_select" >
                        <input type="tool" value = {this.state.tool} onChange={this.changeTool.bind(this)}></input>
                            <option> Chalk </option>
                            <option> Rectangle </option>
                            <option> Line </option>
                        </select>
                    </div>

                    <div className="clear-container">
                    <button onClick={this.clearCanvas}>Clear</button>
                    </div>

                    <div className="save-container">
                    <button value={this.saveCanvas}>Save</button>
                    </div>
                   
                </div>

                <div class="board-container">
                    <Board color= {this.state.color} size= {this.state.size}> tool= {this.state.tool}</Board>
                </div>
            </div>
        )
    }


}

export default Container

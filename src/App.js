import React, { useEffect } from 'react'
import Die from "./Die.js"
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'
import { useTimer } from 'use-timer';

export default function App() {
    const {time, start, pause, reset} = useTimer()
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [count, setCount] = React.useState(0)

    const [attempt, setAttempt] = React.useState(
        JSON.parse(localStorage.getItem('attempt') || null
    ))
    const [bestTime, setBestTime ] = React.useState(
       JSON.parse(localStorage.getItem('bestTime')) || null)

    React.useEffect(() => {
        localStorage.setItem('attempt', attempt)
    }, [attempt])

    React.useEffect(() => {
        localStorage.setItem('bestTime', bestTime)
    }, [bestTime])

    React.useEffect(() => {
        const allHelds = dice.every(die => die.isHeld) 
        const firstValue = dice[0].value
        const allValue = dice.every(die => die.value === firstValue)
         
        if (allHelds && allValue) {
            setTenzies(true)
            pause()
            
            if (attempt > count) {
                setAttempt(count)
            }

            if(time < bestTime) {
                setBestTime(time)
            }
        }
    }, [dice])
    
    function generateNewDice() {
        return {
            value: Math.ceil(Math.random() * 6), 
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
       const arr = []
        
       for (let i = 0; i < 10; i++) {
          arr.push(generateNewDice())
        }
         return arr
    }    
        
    function rollDice() {
        if (!tenzies) {
            setCount(count + 1)
            setDice(prev => 
                prev.map((dice) => {
                    return dice.isHeld ? 
                    dice : generateNewDice()
                }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setCount(0)
            reset()
        }
    }
    
    function holdDice(id) {
        start()
        setDice(prev =>
            prev.map((dice) => {
                return dice.id === id ? {...dice, isHeld: !dice.isHeld} : dice
            })
    )}
        
    const diceElements = dice.map(die => (
         <Die 
            key={die.id} 
            value={die.value}
            isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
        />
))         
    return (
        <main>
            {tenzies && <Confetti /> }

            <h1>{tenzies ? "You won! 🥳" : "Tenzies"}</h1>

            <p>Roll until all dice are the same. 
            Click each die to freeze it at its current 
            value between rolls.</p>
            
            <p className="record">
                🏆 <b>{attempt} </b>
                - ⏱️ <b>{bestTime}s </b>
            </p>

            <div className="dice-container" >
                {diceElements}
            </div>
            
            <div className='buttons'>
            <button className="button-roll" onClick={rollDice}> {tenzies ? "New Game" : "Roll"}</button>
            <p className="number-roll" >{count} rolls </p>
            </div>

            {tenzies && <hr />}
            
            {tenzies &&
                <div className='result'>
                    <p className='p-result'><b>{count}</b> tentativas </p>
                    <p className='p-result'>⏱️ <b>{time}s</b></p>
                </div>
            }
            
        </main>
    )
  }
 
  /** */
import React from "react"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "#FFFFFF"
    }
    
    return (
            <section className="die-face" style={styles} onClick={props.holdDice} >
                <h2 className="die-number"> {props.value}</h2>
            </section>
    )
    
}
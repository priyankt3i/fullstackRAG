"use client";
import React from "react"
import TypewriterComponent from "typewriter-effect"

export default function TypeWriter(){
    return (
        <TypewriterComponent
         options={{
            loop:true,
         }}
         onInit={typewriter=>{
            typewriter.typeString(" ⭐ Effortless Productivity ").start().pauseFor(2000).deleteAll()
            .typeString("✨Infinite Possibilities !")
         }}
         ></TypewriterComponent>
    )
}
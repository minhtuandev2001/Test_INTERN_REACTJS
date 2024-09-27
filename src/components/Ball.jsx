import React, { useEffect, useState } from 'react'

export default function Ball({ ball, handleDeleteBall }) {
  const { index, top, left } = ball;
  const [chooseBall, setChooseBall] = useState(false);
  const handleDelayDeleteBall = () => {
    setChooseBall(true);
    setTimeout(() => {
      handleDeleteBall(ball);
    }, 1500);
  }
  return (
    <div className="ball1"
      onClick={handleDelayDeleteBall}
      style={{
        top: `${top}%`,
        left: `${left}%`,
        zIndex: index,
        backgroundColor: chooseBall ? "red" : "white",
        transition: 'background-color 2s ease'
      }}>
      {index + 1}
    </div>
  )
}
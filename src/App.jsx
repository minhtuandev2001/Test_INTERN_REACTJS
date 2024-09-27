import { v4 as uuidv4 } from 'uuid';
import { useRef, useState } from 'react'
import './App.css'
import Ball from './components/Ball';
import overSound from "./assets/sound/over.mp3"
import playSound from "./assets/sound/play.mp3"
import winSound from "./assets/sound/win.mp3"

function App() {
  const divRef = useRef(null);
  const [numberBall, setNumberBall] = useState(0);
  const [listBall, setListBall] = useState([]);
  const [notification, setNotification] = useState("");
  const [announce, setAnnounce] = useState({
    color: 'black',
    title: "LET'S PLAY"
  });
  const [textPlay, setTextPlay] = useState(true);
  const [time, setTime] = useState(0.0);
  const timeRef = useRef(null);
  const overSoundRef = useRef(null);
  const playSoundRef = useRef(null);
  const winSoundRef = useRef(null);

  const handleRestart = () => {
    if (numberBall <= 0) {
      setNotification("You need to provide the ball number > 0")
      return;
    } else {
      overSoundRef.current.pause()
      winSoundRef.current.pause()
      playSoundRef.current.play()
      setNotification("")
      setTextPlay(false); // đổi nội dung button play => restart 
      setTime(0.0);
      setAnnounce({
        color: 'black',
        title: "LET'S PLAY"
      });
      setListBall([]);
      let arrBall = [];
      for (let i = 0; i < numberBall; i++) {
        let top = Math.floor(Math.random() * 93);
        let left = Math.floor(Math.random() * 93);
        arrBall.push({
          id: uuidv4(),
          index: i,
          top: top,
          left: left,
        })
      }
      timeStart() // khởi động bộ đếm thời gian
      setListBall(arrBall);
    }
  }
  const handleDeleteBall = (ball) => {
    const { id, index } = ball;
    // xóa phần tử
    setListBall(listBallPre => {
      let checkExistBall = listBallPre.some(b => b.id === id)
      // danh sách vẫn chưa bị làm mới lại
      // nếu bị làm mới thì bỏ qua hành động này
      if (checkExistBall) { // chưa làm mới
        // check xóa đúng theo thứ tự
        if (listBallPre[0].index !== index) {
          console.log("check 1", listBallPre[0], index)
          setAnnounce({
            color: 'red',
            title: "GAME OVER"
          });
          playSoundRef.current.pause()
          overSoundRef.current.play();
          timeEnd();
          return listBallPre;
        }
        // kết thúc check xóa đúng theo thứ tự
        let listTemp = listBallPre.filter(item => item.index !== index);
        // kiểm tra game kết thúc
        if (listTemp.length === 0) {
          setAnnounce({
            color: 'green',
            title: "ALL CLEARED"
          });
          playSoundRef.current.pause()
          winSoundRef.current.play();
          timeEnd();
        }
        return listTemp;
      } else {
        return listBallPre;
      }
    });
    // kết thúc xóa phần tử
  }

  const timeStart = () => {
    if (timeRef.current !== null) clearInterval(timeRef.current);
    timeRef.current = setInterval(() => {
      setTime(prevTime => parseFloat((prevTime + 0.1).toFixed(1)));
    }, 100);
  }

  const timeEnd = () => {
    if (timeRef.current) {
      clearInterval(timeRef.current)
    }
    timeRef.current = null; // cập nhật lại timeRef
  }
  return (
    <div className="App">
      <h2 className='header'>GAME PLAY</h2>
      <p className="title" style={{
        color: announce.color,
      }}>{announce.title}</p>
      <div>
        <div className="group">
          <p>Points:</p>
          <input
            value={numberBall}
            type="text" onChange={(e) => setNumberBall(e.target.value)} />
        </div>
        <div className="group">
          <p>Time:</p>
          <p>{time === 0 ? '0.0' : time}s</p>
        </div>
      </div>
      <div className='group_button'>
        <button className="restart" onClick={handleRestart}>{textPlay ? 'Play' : 'Restart'}</button>
        {notification !== "" && <p className='noti'>{notification}</p>}
      </div>
      <div ref={divRef} className="board_game">
        {listBall.length > 0 && listBall.map((ball) =>
          <Ball
            key={(ball.id).toString()}
            handleDeleteBall={handleDeleteBall}
            ball={ball}
          ></Ball>
        )}
      </div>
      <audio ref={overSoundRef}>
        <source src={overSound} type="audio/mpeg" />
      </audio>
      <audio ref={playSoundRef} loop>
        <source src={playSound} type="audio/mpeg" />
      </audio>
      <audio ref={winSoundRef}>
        <source src={winSound} type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default App

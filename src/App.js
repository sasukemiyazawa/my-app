import { getLyrics, getSong } from 'genius-lyrics-api'
import { useEffect, useState } from "react"
var kuromoji = require("kuromoji")
function App() {

  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState()
  const [words, setWords] = useState("")
  const [state, setState] = useState({
    wordData: [],
  })

  const options = {
    apiKey: 'MfNShY6mQttxNRto4uOVx7T0iiustuNsm1-cYIgU2Lyk-2VR_zh8xdMQy_Y1Yw40',
    title: [title],
    artist: [artist],
    optimizeQuery: true
  }

  const onClick = () => {
    getLyrics(options).then((lyrics) => {
      console.log(lyrics)
      setWords(lyrics)
    })
    setArtist("")
    setTitle("")
  }
  
  const analyze = () => {
    const TARGET_POS = ['名詞', '動詞', '形容詞']
    const NO_CONTENT = '*'
    kuromoji.builder({ dicPath: "/dict" }).build(function (err, tokenizer) {
      // tokenizer is ready
      var path = tokenizer.tokenize(words);
      console.log(path);

      const wordData = path
        .filter(t=>TARGET_POS.includes(t.pos))
        .map(t=>t.basic_form === NO_CONTENT ? t.surface_form : t.basic_form)
        .reduce((data, text) => {
          const target = data.find(c=>c.text === text)
          if(target) {
            target.value = target.value + 1
          } else {
            data.push({
              text,
              value: 1
            })
          }
          return data
        }, [])

        setState({wordData})
        console.log(wordData)
    });
    }

  return (
    <>
      <input placeholder="タイトル" value={title} onChange={e=>setTitle(e.target.value)}>
      </input>
      <input placeholder="アーティスト" value={artist} onChange={e=>setArtist(e.target.value)}>
      </input>
      <button onClick={()=>getLyrics(options).then((l)=>onClick(l))}>
        表示する
      </button>
      <button onClick={()=>analyze()}>
        分析する
      </button>
    </>
  )
}

export default App;

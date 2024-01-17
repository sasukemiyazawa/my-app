import { getLyrics, getSong } from 'genius-lyrics-api'
import { useEffect, useState } from "react"
import WordCloud from "react-d3-cloud"
var kuromoji = require("kuromoji")
function App() {

  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState()
  const [lyrics, setLyrics] = useState("")
  const [wordData, setWordData] = useState({
    key: "",
  })
  const [state, setState] = useState(0)

  const options = {
    apiKey: 'MfNShY6mQttxNRto4uOVx7T0iiustuNsm1-cYIgU2Lyk-2VR_zh8xdMQy_Y1Yw40',
    title: [title],
    artist: [artist],
    optimizeQuery: true
  }

  const onClick = (l) => {
    setLyrics(l)
    console.log(l)
  }
  
  const analyze = () => {
    const TARGET_POS = ['名詞', '動詞', '形容詞']
    const NO_CONTENT = '*'
    kuromoji.builder({ dicPath: "/dict" }).build(function (err, tokenizer) {
      // tokenizer is ready
      var path = tokenizer.tokenize(lyrics);
      console.log(path);

      const lyricsData = path
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

        setWordData({lyricsData})
        console.log({lyricsData})
    });
  }

  return (
    <>
      <input placeholder="タイトル" value={title} onChange={e=>setTitle(e.target.value)}>
      </input>
      <input placeholder="アーティスト" value={artist} onChange={e=>setArtist(e.target.value)}>
      </input>
      <button onClick={()=>getLyrics(options).then((lyrics)=>onClick(lyrics))}>
        検索する
      </button>
      <button onClick={()=>analyze()}>
        分析する
      </button>
      <button onClick={()=>setState(1)}>
        表示する
      </button>

      {state == 1 && <WordCloud data={wordData.lyricsData} fontSize={word=>word.value * 8}/>}


    </>
  )
}

export default App;

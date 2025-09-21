import { useState } from "react";
export default function App() {
  const [username,setUsername]=useState("nike");
  const [reels,setReels]=useState<any[]>([]);
  const [loading,setLoading]=useState(false);

  async function fetchReels(){
    setLoading(true);
    const res = await fetch(`http://localhost:3000/scrape?username=${encodeURIComponent(username)}&limit=6`);
    const json = await res.json();
    setReels(json.reels || []);
    setLoading(false);
  }

  return (
    <div style={{padding:20}}>
      <input value={username} onChange={e=>setUsername(e.target.value)} />
      <button onClick={fetchReels} disabled={loading}>Fetch</button>
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:12}}>
        {reels.map(r=>(
          <div key={r.id} style={{border:"1px solid #ddd", padding:8}}>
            <img src={r.thumbnail_url || ""} style={{width:"100%"}} />
            <div>{r.caption?.slice(0,100)}</div>
            <div>{r.posted_at}</div>
            {r.video_url && <a href={r.video_url}>mp4</a>}
          </div>
        ))}
      </div>
    </div>
  );
}

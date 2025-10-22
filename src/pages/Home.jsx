// src/pages/Home.jsx
import React from "react";
import ProfileCard from "../components/ProfileCard";
import Tile from "../components/Tile";
import SkillMeters from "../components/SkillMeters";
import StatsStrip from "../components/StatsStrip";
import Radar from "../components/Radar"; // 레이더 추가
import { Leaf, Swords, Trophy, Map, Store, PenLine, Settings, IdCard, MessageSquare } from "lucide-react";

export default function Home({ hud }) {
  const tiles = [
  { icon:Leaf,        title:"Growth · Good Habit",  desc:"습관 트래킹",     href:"#growth" },
  { icon:Swords,      title:"Fight · Bad Habit",    desc:"나쁜 습관 퀘스트", href:"#fight" },
  { icon:Trophy,      title:"Goal · Objective",     desc:"목표/OKR",         href:"#goal" },
  { icon:Map,         title:"Stage · P.A.R.A.",     desc:"프로젝트/영역",     href:"#para" },
  { icon:Store,       title:"Marketplace · Reward", desc:"보상 상점",        href:"#market" },
  { icon:PenLine,     title:"Activity Log · Journal",desc:"저널/활동 로그", href:"#journal" },
  { icon:Settings,    title:"Settings",             desc:"설정",             href:"#settings" },
  { icon:IdCard,      title:"Profile · Vision",     desc:"비전 보드",        href:"#vision" },
  { icon:MessageSquare,title:"Community · Chat",    desc:"메모/코멘트",      href:"#chat" },
];

  return (
    <div className="container">
      <div className="grid">
        {/* 왼쪽 컬럼 */}
        <div className="left">
          <ProfileCard player={hud?.player} />

          <div className="section">
            <div className="section-title">Skill Points</div>
            <SkillMeters player={hud?.player} />
          </div>

          {/* >>> Radar 섹션은 여기(왼쪽 컬럼, return 내부) <<< */}
          <div className="section">
            <div className="section-title">Character Identity</div>
            <Radar />
          </div>
        </div>

        {/* 오른쪽 컬럼 */}
        <div className="right">
          <div className="welcome">WELCOME TO LiFE RPG</div>
          <StatsStrip kpi={hud?.kpi} />
          <div className="tile-grid">
            {tiles.map((t) => (
              <Tile key={t.title} {...t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


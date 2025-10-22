// src/components/ErrorBoundary.jsx
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError:false, msg:"" }; }
  static getDerivedStateFromError(err){ return { hasError:true, msg:String(err) }; }
  componentDidCatch(err, info){ console.error("Render error:", err, info); }
  render(){
    if (this.state.hasError){
      return (
        <div className="page">
          <div className="panel">
            <div className="panel-title">Render Error</div>
            <div style={{padding:12,color:"#fca5a5"}}>{this.state.msg}</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

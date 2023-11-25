import { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Tutorial1 from "./component/tutorial/Tutorial1";
import Tutorial2 from "./component/tutorial/Tutorial2";
import Tutorial3 from "./component/tutorial/Tutorial3";
import Tutorial4 from "./component/tutorial/Tutorial4";
import Tutorial5 from "./component/tutorial/Tutorial5";
import Play from "./Play";
import "./style.css";
import ButtonAppBar from "./component/ButtonAppBar";
import { useApiPasswordContext } from "./common/api-password";
import ApiPasswordDialog from "./component/ApiPasswordDialog";

function App() {
  const { password } = useApiPasswordContext();
  const [isApiPasswordDialogOpen, setIsApiPasswordDialogOpen] = useState(false);

  return (
    <div className="App">
      <ButtonAppBar
        openApiPasswordDialog={() => {
          setIsApiPasswordDialogOpen(true);
        }}
      />
      <div className="link-container">
        <Link to="/tutorial1" className="button">
          <div>
            <h2>基本操作のチュートリアル</h2>
            <p>機体を動かすための基本操作を知りましょう。まずはここから。</p>
          </div>
        </Link>
        <Link to="/tutorial2" className="button">
          <div>
            <h2>移動のチュートリアル</h2>
            <p>2種類ある機体の移動方法を学びましょう。</p>
          </div>
        </Link>

        <Link to="/tutorial3" className="button">
          <div>
            <h2>論理のチュートリアル</h2>
            <p>条件で場合を分けて異なる行動を行えるようにしましょう。</p>
          </div>
        </Link>

        <Link to="/tutorial4" className="button">
          <div>
            <h2>武器のチュートリアル</h2>
            <p>戦闘を有利に進められる武器の使用方法を学びましょう。</p>
          </div>
        </Link>

        <Link to="/tutorial5" className="button">
          <div>
            <h2>スピードアップのチュートリアル</h2>
            <p>スピードアップアイテムの使用方法を学びましょう。</p>
          </div>
        </Link>

        <Link to="/play" className="button">
          <div>
            <h2>チュートリアルをスキップ</h2>
            <p />
          </div>
        </Link>
      </div>

      <Routes>
        <Route path="/play" element={<Play />} />
        <Route path="/tutorial1" element={<Tutorial1 />} />
        <Route path="/tutorial2" element={<Tutorial2 />} />
        <Route path="/tutorial3" element={<Tutorial3 />} />
        <Route path="/tutorial4" element={<Tutorial4 />} />
      </Routes>
      {!password && isApiPasswordDialogOpen && (
        <ApiPasswordDialog
          onClose={() => {
            setIsApiPasswordDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default App;

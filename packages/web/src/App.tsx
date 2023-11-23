import { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Tutorial1 from "./component/tutorial/Tutorial1";
import Tutorial2 from "./component/tutorial/Tutorial2";
import Tutorial3 from "./component/tutorial/Tutorial3";
import Tutorial4 from "./component/tutorial/Tutorial4";
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
            <h2>Tutorial 1</h2>
            <p>Learn about Tutorial 1.</p>
          </div>
        </Link>
        <Link to="/tutorial2" className="button">
          <div>
            <h2>Tutorial 2</h2>
            <p>Learn about Tutorial 2.</p>
          </div>
        </Link>

        <Link to="/tutorial3" className="button">
          <div>
            <h2>Tutorial 3</h2>
            <p>Learn about Tutorial 3.</p>
          </div>
        </Link>

        <Link to="/tutorial4" className="button">
          <div>
            <h2>Tutorial 4</h2>
            <p>Learn about Tutorial 4.</p>
          </div>
        </Link>

        <Link to="/play" className="button">
          <div>
            <h2>Play</h2>
            <p>Play</p>
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

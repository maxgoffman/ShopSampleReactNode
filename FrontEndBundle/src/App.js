/** 
  * @desc Application component: starts react, redux store and react router
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required react react-router-dom react-redux ...
*/
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import Main from './components/MainComponent';
import './App.scss';

//starts redux store
const store = ConfigureStore();

//Wraps main component with redux and react router
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Main />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
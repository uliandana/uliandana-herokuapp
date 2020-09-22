import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import main from '../pages/Main/reducer';

const rootReducer = combineReducers({
  form: formReducer,
  routing: routerReducer,
  main,
});

export default rootReducer;

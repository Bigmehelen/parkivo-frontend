import {Provider} from "react-redux";
import {store} from "../store/store";
import {Slot} from "expo-router";

function App() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
export default App;
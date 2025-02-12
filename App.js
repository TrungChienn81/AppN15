// App.js
import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";

const App = () => {
  // Trả về Navigator, không dùng PaperProvider
  return <AppNavigator />;
};

export default App;

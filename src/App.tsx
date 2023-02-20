import "./App.css";
import { ChartComponent } from "./components/ChartComponent";

function App() {
  return (
    <div className="bg-gray-100 w-screen h-screen flex flex-row">
      <div className="bg-white w-[300px] p-6 space-y-6">
        {/* sidebar */}
        <div className="font-bold text-xl">Network Performance Framework</div>
        <ul className="space-y-2">
          <li className="font-bold">Home</li>
          <li>Device 1</li>
          <li>Device 2</li>
          <li>Device 3</li>
          <li>Device 4</li>
        </ul>
      </div>
      <div className="p-6">
        <div className="flex flex-row gap-6">
          {[1, 2, 3, 4].map((index) => (
            <div className="bg-white rounded-xl p-6 space-y-2" key={index}>
              <div>Experiments count</div>
              <div className="mx-auto w-max text-blue-500">17</div>
            </div>
          ))}
        </div>
        <div>
          <ChartComponent></ChartComponent>
        </div>
      </div>
      {/* Main page */}
    </div>
  );
}

export default App;

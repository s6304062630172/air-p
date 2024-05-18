import React, { useState, useEffect } from "react";

const calculateBTU = (width, length, roomType, hasElectricity, numberOfPeople) => {
  let baseBTU;
  switch (roomType) {
    case "normal":
      baseBTU = hasElectricity ? 800 : 750;
      break;
    case "office":
      baseBTU = hasElectricity ? 900 : 850;
      break;
    case "restaurant":
    case "hairSalon":
    case "minimart":
    case "shop":
    case "office":
      baseBTU = hasElectricity ? 1100 : 950;
      break;
    case "meetingRoom":
    case "restaurantBuffet":
    case "hotpotRestaurant":
    case "grillRestaurant":
      baseBTU = hasElectricity ? 1500 : 1100;
      break;
    default:
      baseBTU = 750;
  }

  let btu = width * length * baseBTU;
  if (numberOfPeople > 1) {
    btu *= 1.05;
  }
  return btu;
};

const CalculateBTU = ({ BTU_statusModal, returnCloseBTUModal }) => {
  const [width, setWidth] = useState(0);
  const [length, setLength] = useState(0);
  const [hasElectricity, setHasElectricity] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [roomType, setRoomType] = useState("normal");
  const [show, setShow] = useState(false);
  const [btu, setBTU] = useState("");
  useEffect(() => {

  }, [BTU_statusModal]);

  const handleCalculate = () => {
    setBTU(calculateBTU(width, length, roomType, hasElectricity, numberOfPeople))
    setShow(true);
  };

  return (
    <dialog id="BTU_modal" className="p-3 rounded">
      <button
        className="rounded-full bg-red-900 hover:bg-red-700 text-white font-bold py-2 px-4 absolute right-5 top-7"
        onClick={returnCloseBTUModal}
      >
        ✕
      </button>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">BTU Calculator</h1>
        <div className="mb-4">
          <label className="block mb-2">ความกว้างห้อง (m)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(parseFloat(e.target.value))}
            className="border rounded-md bg-white w-full px-12 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">ความยาวห้อง (m)</label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(parseFloat(e.target.value))}
            className="border rounded-md bg-white w-full px-12 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Room Type</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="border rounded-md bg-white w-full px-12 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="normal">Normal</option>
            <option value="office">Office</option>
            <option value="restaurant">Restaurant</option>
            <option value="hairSalon">Hair Salon</option>
            <option value="minimart">Minimart</option>
            <option value="shop">Shop</option>
            <option value="meetingRoom">Meeting Room</option>
            <option value="restaurantBuffet">Restaurant (Buffet)</option>
            <option value="hotpotRestaurant">Hotpot Restaurant</option>
            <option value="grillRestaurant">Grill Restaurant</option>
          </select>
        </div>
        <div className="mb-4 flex">
          <label className="block mb-2 mr-6">ห้องโดนแสงอาทิตย์เข้า</label>
          <input
            type="checkbox"
            checked={hasElectricity}
            onChange={(e) => setHasElectricity(e.target.checked)}
            className="mr-2 mb-2"
          />
          ใช่?
        </div>
        <div className="mb-4">
          <label className="block mb-2">จำนวนคนอาศัยภายในห้อง</label>
          <input
            type="number"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
            className="border rounded-md bg-white w-full px-12 py-2 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>
        <button onClick={handleCalculate} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Calculate
        </button>

        {show && (
          <div className="mt-3">
            <label className="text-medium">ขนาด BTU ที่เหมาะสม :</label>
            <input disabled type="text" className="form-control" id="btu" name="btu" value={btu} />
            <label className="text-sm">โดยสามารถเพิ่ม หรือ ลด ได้ ไม่เกิน 1000 ถึง 2000 BTU จะเหมาะสม </label>

          </div>
        )}
      </div>
    </dialog>
  );
};

export default CalculateBTU;

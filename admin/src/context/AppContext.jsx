import { createContext } from "react";



export const AppContext = createContext()


const AppContextProvider = (props) => {

  let currency ='$'

  const calculateAge = (dob)=>{
    const today = new Date()
    const birthDay = new Date(dob);

    let age = today.getFullYear() - birthDay.getFullYear()
    return age
  }

  const months = [
      "",
      "Jan",
      "Fab",
      "Mar",
      "Apr",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  
    const slotDateFormate = (slotDate) => {
      const dateArray = slotDate.split("_");
      return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
    };
  

    const value = {
      calculateAge,
      slotDateFormate,currency
    }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider;
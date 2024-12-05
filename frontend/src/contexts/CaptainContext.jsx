import React,{createContext, useState} from 'react'
export const CaptainDataContext = createContext();

export default function CaptainContext({children}){
   
    const [user,setUser] = useState({
        fullName: {
            firstName: "",
            lastName: ""
        },
        password: "",
        email: "",
        status: "",
        vehicle:{
            color: "",
            plate: "",
            capacity: "",
            vehicleType: ""
        },
        location: {
            lat: null,
            long: null
        }
    })

    return(
        <div>
            <CaptainDataContext.Provider value={[user, setUser]}>
            {children}
            </CaptainDataContext.Provider>
        </div>
    )
}
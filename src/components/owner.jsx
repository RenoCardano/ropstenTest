import React, { PureComponent } from 'react'
import {useEth} from "../contexts/EthContext";
import { useEffect } from 'react';

export default function GetOwner({ setOwner, setcurrentAccount}){
    const { state: { contract, accounts } } = useEth();
 
    const getowner = async () => { 
        let response = undefined;
        try {
        response = await contract.methods.owner().call();
        setcurrentAccount(accounts);
        setOwner(response);
        console.log("responseOwner")
        console.log(response)
        } catch (err) {
          console.log(err);
        }
      };
        
      useEffect(() => {
        if(contract){
          getowner();
        }
      
    }, [contract]);
 
}

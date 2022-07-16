import { useState } from "react";
import {useEth} from "../../contexts/EthContext";
import { Button } from "../../ui/Button";

export default function RegistrationForm({ comment, setValue, setError }) {
  const { state: { contract, accounts } } = useEth();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e)  => {
      e.preventDefault(); 
      setError(null)
      setLoading(true)
      const data = e.target[0].value;
      
          await contract.methods.addVoter(data.toString()).send({ from: accounts[0] }).then(response => {
          setLoading(false);
          setValue(response.events.VoterRegistered);
        }).catch(error => {
          console.log("erreur dans async proposal form")
          console.error(error);
          setError(error.message)
        }); 
        setLoading(false);
    }
    
  return (    <div className="container-fluid" >
  <div className="card bg-light text-dark border-grey">
    <form onSubmit={handleSubmit}>
      {error ? <Alert>{error}</Alert> : null}
      {comment ? <Alert> The voter {comment.returnValues.voterAddress} was successfully registered</Alert> : null}
        <div className="form-group">
        <label for="exampleInputEmail1">Enter an Eth address to register a new voter </label>
            <input type="text" name="address" id="address" className="form-control" required />
        </div>
        <Button type="submit" loading={loading}> Register the Voter </Button>
    </form>
    </div>
    </div>
  );
}


export function Alert({ children }) {
  return <div className="alert alert-info">
      {children}
  </div>
}
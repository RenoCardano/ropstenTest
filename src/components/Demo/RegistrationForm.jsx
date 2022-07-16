import { useState } from "react";
import { useEth } from "../../contexts/EthContext";
import { Button } from "../../ui/Button";
import { Alert } from "react-bootstrap";

export default function RegistrationForm({ error, comment, setValue, setError , setRegisteredAdress}) {
  const { state: { contract, accounts } } = useEth();
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const data = e.target[0].value;
    await contract.methods.addVoter(data.toString()).send({ from: accounts[0] }).then(response => {
      setLoading(false);
      setValue(response.events.VoterRegistered);
      setRegisteredAdress(prevArray => [...prevArray, response.events.VoterRegistered.returnValues.voterAddress] )
    }).catch(error => {
    
     if(error.code == "INVALID_ARGUMENT"){
        setError(error.code)
      } else {
        setError(error.message)
      }
      setLoading(false);
    });
    setLoading(false);
  }

  return (<div className="container-fluid" >
    <div className="card bg-light text-dark border-grey">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
        {error ? <Alert className="alert alert-warning"> {error} </Alert> : null}
          <label for="exampleInputEmail1">Enter an Eth address to register a new voter </label>
          <input type="text" name="address" id="address" className="form-control" required />
        </div>
        <div className="btn-group">
        <Button type="submit" loading={loading}> Register the Voter </Button>
        </div>
      </form>
    </div>
  </div>
  );
}


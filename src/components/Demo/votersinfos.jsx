import { useState } from "react";
import {useEth} from "../../contexts/EthContext";
import { Button } from "../../ui/Button";
import { Alert } from "react-bootstrap";

export default function VotersInfo({ votersInfo, setvotersInfo, setError }) {
  const { state: { contract, accounts } } = useEth();

  console.log(votersInfo);
  let {hasVoted, isRegistered, votedProposalId } = votersInfo;
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e)  => {
      e.preventDefault(); 
      setLoading(true)
      const data = e.target[0].value;
      await contract.methods.getVoter(data).call({ from: accounts[0] }).then(response => {
          setvotersInfo(response);
          setLoading(false)
      }).catch(error => {
        if(error.code === 32603){
          setError("you are not a voter")
          setLoading(false)
        } else {
          setError(error.message)
          setLoading(false)
        }

        setLoading(false)
      }); 
      }
    
  return (
    <div className="container-fluid" >
    <div className="card bg-light text-dark border-grey">

      {!votersInfo.isRegistered ? <Alert className="alert alert-warning"> The voter is NOT registered yet </Alert> : null}
      {votersInfo.isRegistered && !hasVoted? <Alert className="alert alert-warning"> The voter is registered but did not vote yet </Alert> : null}
      {votersInfo.hasVoted? <Alert className="alert alert-warning"> The voter has vote for {votersInfo.votedProposalId}  </Alert> : null}
        <form  onSubmit={handleSubmit}>
        <div className="form-group">
        <label for="title">Enter the Eth address : </label>
            <input type="text" name="address" id="address" className="form-control" required />
            <small id="help" className="form-text text-muted">Enter the Eth address of a voter to get status</small>
        </div>
        <Button type="submit" loading={loading}> Get Voters Status </Button>
    </form>
    </div>
    </div>
   
  );
}


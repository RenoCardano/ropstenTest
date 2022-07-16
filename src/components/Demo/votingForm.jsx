import { useState } from "react";
import { useEth } from "../../contexts/EthContext";
import { Button } from "../../ui/Button";

export default function VotingForm({ setValue, setError }) {
  const { state: { contract, accounts } } = useEth();
  const [loading, setLoading] = useState(false)
  let [proposal, setProposal] = useState([])

  let { description, voteCount } = proposal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null)
    setLoading(true)
    const data = parseInt(e.target[0].value, 10);
    let ProposalId = null;
    // console.log(e.target)

    await contract.methods.setVote(data).send({ from: accounts[0] }).then(response => {
      ProposalId = parseInt(response.events.Voted.returnValues.proposalId, 10)
      setValue(response.events.Voted)
    }).catch(error => {
      console.log("erreur dans async setVote")
      console.error(error);
      setError(error.message)
    });

    if (ProposalId != null) {
      await contract.methods.getOneProposal(ProposalId).call({ from: accounts[0] }).then(response => {
        setProposal(response)
      }).catch(error => {
        console.log("erreur dans async getOneProposal")
        console.error(error);
        setError(error.message)
      });
    }

    setLoading(false)
  }

  return (<>

    <div className="container-fluid" >
      <div className="card bg-light text-dark border-grey">

        <form onSubmit={handleSubmit}>

          {description ? <Alert> The proposal : {description} has now {voteCount} vote(s)</Alert> : null}
          <div className="form-group">
            <small id="emailHelp" className="form-text text-muted">Vote for one of the proposition down below</small>
            <input type="text" name="vote" id="vote" className="form-control" required />
            <small id="emailHelp" className="form-text text-muted">Vote using the proposition number.</small>
          </div>
          <Button type="submit" loading={loading}> Enter an index to vote for a proposal </Button>
        </form>
      </div>
    </div>
  </>
  );
}



export function Alert({ children }) {
  return <div className="alert alert-info">
    {children}
  </div>
}
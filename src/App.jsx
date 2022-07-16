import {useEth , EthProvider } from "./contexts/EthContext";
import { useState } from "react";
import RegistrationForm from "./components/Demo/RegistrationForm";
import "./App.css";
import VotersInfo from "./components/Demo/votersinfos";
import GetOwner from "./components/owner";
import Workflow from "./components/Demo/workflow";
import ProposalForm from "./components/Demo/proposalForm";
import ErrorBoundary from "./components/Errors/ErrorBoudaries"
import VotingForm from "./components/Demo/votingForm";
import Proposals from "./components/Demo/cardProposals";
import { Button } from "./ui/Button";
import WinnerCard from "./components/Demo/winnerCard";
import { Alert } from "react-bootstrap";
import { CardRegistered } from "./components/Demo/cardRegistered";
import { useEffect } from "react";

export default function App() {

    //connaitre sur quelle pages nous sommes
    let [page, setPage] = useState('registration')
    //get registration event and addresses
    let [value, setValue] = useState(false);
    //contract addresses
    let [contratOwner, setOwner] = useState(false);
    let [currentAccount, setcurrentAccount] =  useState("");
    //get inforamtion related to the voters
    let [votersInfo, setvotersInfo] = useState(false);
    let content = null
    let contentProposalCard = null
    let contentWinnerCard = null;
    let contentCurrentRegisteredVoters = null;
    let contentProposalCardRegisterPage = null;
    let [events, setEvent] = useState(0);
    let [workflow, setWorkFlow] = useState(0);
    let [proposalId, setProposalID] = useState([]);
    let [winner, setWinner] = useState(false)
    let [RegisteredAdress, setRegisteredAdress] = useState([]);
    let [resultPage, setresultPage] =  useState(false)

    //gestion des erreurs 
    let [error, setError] = useState();
   
   const pages = () => { if (page === 'registration') {
        content = contratOwner == currentAccount ? <RegistrationForm setRegisteredAdress={setRegisteredAdress} comment={value} setError={setError} setValue={setValue} ></RegistrationForm> : null
        contentCurrentRegisteredVoters = <CardRegistered registeredAdress={RegisteredAdress} ></CardRegistered>
       } else if (page === 'workflow') {
        content = contratOwner == currentAccount ? <Workflow workflow={workflow} setWorkFlow={setWorkFlow} setError={setError} setEvent={setEvent} ></Workflow> : null
       } else if (page === 'getvoters') {
        content =  <VotersInfo setvotersInfo={setvotersInfo} setError={setError} votersInfo={votersInfo}> </VotersInfo>
       } else if (page === 'proposition') {
        content = <ProposalForm setValue={setValue} setError={setError} setProposalID={setProposalID}></ProposalForm>
        contentProposalCard = <Proposals setError={setError} proposals={proposalId} ></Proposals>
       } else if (page === 'vote') {
        content =  <VotingForm setError={setError} setValue={setValue}/>
        contentProposalCard = <Proposals setError={setError} proposals={proposalId} ></Proposals>
       } else if (page === 'results') {
        contentWinnerCard = <WinnerCard setError={setError} winner={winner} ></WinnerCard>
     } else if (page === 'registeredVoters') {
       contentCurrentRegisteredVoters = <CardRegistered registeredAdress={RegisteredAdress} ></CardRegistered>
       contentProposalCardRegisterPage = <Proposals setError={setError} proposals={proposalId} ></Proposals>
    }
    }   

           pages();
   
    
//attion ajout de alert error
  return (
    <ErrorBoundary>
    <EthProvider setError={setError}>
      <GetOwner setOwner={setOwner} setcurrentAccount={setcurrentAccount}> </GetOwner>
      <NavBar currentPage={page} resultPage={resultPage} setError={setError} setresultPage={setresultPage} workflow={workflow} setWinner={setWinner} onClick={setPage} setWorkFlow={setWorkFlow} contratOwner={contratOwner} account={currentAccount}/>
      <div id="App" >
        <div className="container">
        {error ? <Alert className="alert alert-warning"> {error} </Alert> : null}
        {content}
        {contentProposalCard}
        {contentCurrentRegisteredVoters}
        {contentWinnerCard}
        <br />
        {contentProposalCardRegisterPage}
        </div>
      </div>
    </EthProvider>
    </ErrorBoundary>
  );
}


function NavBar({ currentPage, onClick , contratOwner, account, workflow, setWorkFlow, setWinner, resultPage, setresultPage, setError}) {

   const { state: { contract, accounts } } = useEth();
 
  const [loading, setLoading] = useState(false)

   const onChange = function () {
    setError(null)
    //console.log("I'm in")
  } 

  const navClass = function (page) {
      let className = 'nav-item'
      if (page === currentPage) {
          className = ' active'
      }
      return className;
  }

  useEffect(function (currentPage) {
      onChange(setError(null))
   }, [currentPage])


  const handleSubmit = async (e)  => {
      e.preventDefault(); 
      setLoading(true)
         
     await contract.methods.tallyVotes().send({ from: accounts[0] }).then(response => {
      //cencer passer à 5
         setWorkFlow(response.events.WorkflowStatusChange.returnValues.newStatus)
         console.log(" tally votes pour recup nextstatus")
          console.log(response.events.WorkflowStatusChange.returnValues.newStatus)
        }).catch(error => {
          console.log("erreur dans async tally vote")
          console.error(error);
          setError(error.message)
        });
      
        await contract.methods.winningProposalID().call({ from: accounts[0] }).then(winningId => {
          console.log("winningId")
          console.log(winningId)
          setWinner(winningId);
          //si la requete passe alors j'affiche l'onglet resultat
          setresultPage(true);
        }).catch(error => {
          console.log("erreur dans async getwinning proposal")
          console.error(error);
          setError(error.message)
          setLoading(false);
        });
    setLoading(false);
    }

  return <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-10">
      <a href="#recipes" className="navbar-brand" onClick={() => onClick('registration')}>MyVotingDApp 🗳️</a>
      <ul className="navbar-nav mr-auto">
        { contratOwner == account && workflow == '0' ? <li className={navClass('registration')}>
              <a href="#registration" className="nav-link" onClick={() => onClick('registration')} onChange={onChange}>Registration</a>
          </li> : null }
          { contratOwner == account ? <li className={navClass('workflow')}>
              <a href="#workflow" className="nav-link" onClick={() => onClick('workflow')}>Workflow</a>
          </li> : null }
          <li className={navClass('getvoters')}>
              <a href="#getvoters" className="nav-link" onClick={() => onClick('getvoters')}>Voters Informations</a>
          </li> 
          { workflow == '1'?
         <li className={navClass('proposition')}>
              <a href="#proposition" className="nav-link" onClick={() => onClick('proposition')}> Make a Proposal</a>
          </li>  : null }
          { workflow == '3'?
          <li className={navClass('vote')}>
              <a href="#vote" className=" nav-link" onClick={() => onClick('vote')}>Vote</a>
          </li> : null }
        {resultPage ? 
          <li className={navClass('results')}>
              <a href="#vote" className=" nav-link" onClick={() => onClick('results')}>Results</a>
          </li> : null }
          <li className={navClass('registeredVoters')}>
              <a href="#vote" className=" nav-link" onClick={() => onClick('registeredVoters')}> Registered Voters</a>
          </li> 
        </ul>
        <button type="button" className="btn btn-outline-success">Your account is {account}</button>
      
      {workflow == '0' ? <button type="button" className="btn btn-outline-warning"> State : Registration</button> : null}
      {workflow == '1' ? <button type="button" className="btn btn-outline-warning"> State : Start Proposal Registration</button> : null}
      {workflow == '2' ? <button type="button" className="btn btn-outline-warning"> State : End of Proposal Registration</button> : null}
      {workflow == '3' ? <button type="button" className="btn btn-outline-warning"> State : Start Voting</button> : null}
      {workflow == '4' ? <button type="button" className="btn btn-outline-warning"> State : End Voting</button> : null}
      {workflow == '5' ? <button type="button" className="btn btn-outline-primary"> Vote were tallied: please check the results &#128521; </button> : null}
     
      {workflow == '4' ? <Button type="submit" onClick={handleSubmit} loading={loading}> Tally voting </Button> : null}
  </nav>
}

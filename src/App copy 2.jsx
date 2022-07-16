import { EthProvider} from "./contexts/EthContext";
import { useState } from "react";
import RegistrationForm from "./components/Demo/RegistrationForm";
import "./App.css";
import { useEffect } from "react";
import { Alert } from "./components/Demo/votersinfos";
import { Modal } from "./ui/Modal";
import VotersInfo from "./components/Demo/votersinfos";
import GetOwner from "./components/owner";
import {useEth} from "./contexts/EthContext";
import Workflow from "./components/Demo/workflow";
import ProposalForm from "./components/Demo/proposalForm";
//import logovote from "./logovote.png";
import ErrorBoundary from "./components/Errors/ErrorBoudaries"
import VotingForm from "./components/Demo/votingForm";

function App() {

    //-1 creer les btn de changement de workflow
    //-2 les fonctions on click handle click
    //-3 monter le composant
    //-4 passser une fonction de callback pour obtenir l'evenement
    //-5 callcack pour enregistrement de l'état du workflow
    //-6 descendre l'état dans la navbar ou dans le corps pour affichier event 
    //-7 voir comment récupérer l'errreur du require!!

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
    
    let {hasVoted, isRegistered, votedProposalId } = votersInfo;
    let [events, setEvent] = useState(0);
    let [workflow, setWorkFlow] = useState(0);

    //experiement
    let [data, setData] = useState();

    let {[...], returnValues , event } = value;

    
   const pages = () => { if (page === 'registration') {
        content = contratOwner == currentAccount ? <RegistrationForm setValue={setValue} ></RegistrationForm> : null
       } else if (page === 'workflow') {
        content = contratOwner == currentAccount ?  <Workflow setWorkFlow={setWorkFlow} setEvent={setEvent} ></Workflow> : null
       } else if (page === 'getvoters') {
        content =  <VotersInfo setvotersInfo={setvotersInfo}> WorkFow Management </VotersInfo>
       } else if (page === 'proposition') {
        content = <ProposalForm setData={setData}></ProposalForm>
       } else if (page === 'vote') {
        content =  <VotingForm setValue={setValue}/>
       } else if (page === 'results') {
     }
    }   
    
    pages();

    const {
      proposalId,
      eventProposal,
      proposals,
      fetchProposal
  } = useProposals({data});

    
    useEffect(function () {
    //  if (page === 'vote') {
          fetchProposal()
    //  }
     
  }, [fetchProposal])


  return (
    <ErrorBoundary>
    <EthProvider>
        
       <NavBar currentPage={page} workflow={workflow} onClick={setPage} contratOwner={contratOwner} account={currentAccount}/>
       <GetOwner setOwner={setOwner} setcurrentAccount={setcurrentAccount}></GetOwner>
      <div id="App" >
        <div className="container">
        {value && page === 'registration' ? <Alert> {"The address " + returnValues.voterAddress + " has been registered and the event" + event + " has been triggered"} </Alert> : ""}
        {isRegistered && !hasVoted && page === 'getvoters' ? <Alert> {"This address is registered to vote but did not vote yet"} </Alert> : ""}
        {!isRegistered && !hasVoted && page === 'getvoters' ? <Alert> {"This address is not registered, please enter an another address"} </Alert> : ""}
        {hasVoted && page === 'getvoters'? <Alert> {"This address has voted for the index proposal "+ votedProposalId } </Alert> : ""}
        {value && page === 'proposition' ? <Alert> {"the event" + event + " has been triggered with an index :" + returnValues.proposalId} </Alert> : ""}
        {value && page === 'vote' ? <Alert> {"the event" + event + " has been triggered with an index :" + returnValues.proposalId} </Alert> : ""}
        <br />
        {content}
        {proposals}
        <br />
    
        </div>
      </div>   
    </EthProvider>
    </ErrorBoundary>
  );
}

export default App;

function NavBar({ currentPage, onClick , contratOwner, account, workflow}) {

  const navClass = function (page) {
      let className = 'nav-item'
      if (page === currentPage) {
          className = ' active'
      }
      return className;
  }

  return <nav className="navbar navbar-expand-sm navbar-dark bg-black mb-4">
      <a href="#recipes" className="navbar-brand" onClick={() => onClick('registration')}>MyVotingDApp</a>
      <ul className="navbar-nav mr-auto">
        { contratOwner == account && workflow == '0' ? <li className={navClass('registration')}>
              <a href="#registration" className="nav-link" onClick={() => onClick('registration')}>Registration</a>
          </li> : null }
          { contratOwner == account ? <li className={navClass('workflow')}>
              <a href="#workflow" className="nav-link" onClick={() => onClick('workflow')}>Workflow</a>
          </li> : null }
          <li className={navClass('getvoters')}>
              <a href="#getvoters" className="nav-link" onClick={() => onClick('getvoters')}>Voters Informations</a>
          </li> 
         <li className={navClass('proposition')}>
              <a href="#proposition" className="nav-link" onClick={() => onClick('proposition')}> Make a Proposal</a>
          </li> 
          { workflow == '3'?
          <li className={navClass('vote')}>
              <a href="#vote" className=" nav-link" onClick={() => onClick('vote')}>Vote</a>
          </li> : null }
          { workflow == '4'?
          <li className={navClass('results')}>
              <a href="#vote" className=" nav-link" onClick={() => onClick('results')}>Results</a>
          </li> : null}
          <button type="button" className="btn btn-outline-success">Your account is {account}</button>
      </ul>
      {workflow == '0' ? <button type="button" className="btn btn-outline-warning"> State : Registration</button> : null}
      {workflow == '1' ? <button type="button" className="btn btn-outline-warning"> State : Start Proposal Registration</button> : null}
      {workflow == '2' ? <button type="button" className="btn btn-outline-warning"> State : End of Proposal Registration</button> : null}
      {workflow == '3' ? <button type="button" className="btn btn-outline-warning"> State : Start Voting</button> : null}
      {workflow == '4' ? <button type="button" className="btn btn-outline-warning"> State : End Voting</button> : null}
      {workflow == '4' ? <button type="button" className="btn btn-outline-primary"> Tally vote </button> : null}

  </nav>
}

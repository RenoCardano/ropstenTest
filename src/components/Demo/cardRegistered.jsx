import React, { memo } from 'react'

export function CardRegistered({ registeredAdress }) {
  
     return <div className="row">
        {registeredAdress.map(voterId => <div className="col-md-4 mb-4" key={voterId}>
          <RegisteredCard voterId={voterId} />
        </div>)}
    </div>
}

const RegisteredCard = memo(function ({ voterId }) {
    return <div className="card bg-light text-dark border-grey">
        <div className="card-body">
            <h5 className="card-title"> Voter successfully registered 🥳 </h5>
            <p className="card-text"> Address : {voterId} </p>
        </div>
    </div>
})
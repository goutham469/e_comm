import React from 'react'

function FlashCard({ text, href }) {
  return (
    <div className='flex justify-center'>
        <div onClick={ e=>{
            e.preventDefault();
            window.open(href);
        } }>
            <p>{text}</p>
        </div>
    </div>
  )
}

export default FlashCard
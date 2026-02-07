import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { API } from '../utils/API';
import GoogleAuth from '../components/GoogleAuth';

function Register() {
  return (
    <div className='flex justify-around'>
      <div className='bg-stone-50 p-3 m-3 rounded-md' >
        <p>Register</p>
        <ManualRegistration />
        <p className='text-center mb-2'>or</p>
        <GoogleAuth />
      </div>
    </div>
  )
}

export default Register;

function ManualRegistration({  })
{
  const [ form, setForm ] = useState({});
  const [ stage, setState ] = useState(0);

  async function sendOTP(e)
  {
    e.preventDefault();
    const {email} = form;
    if(!email){ toast.error("provide email"); return }

    const response = await API.register( form );
    console.log(response);
  }

  return <div className='flex justify-center'>
          {
            stage == 0 ?
            <form>
              <label className='m-2'>Enter your email id</label>
              <br/>
              <input 
                type='email'
                className='border m-2 p-1'
                onChange={ e => setForm({...form, email:e.target.value}) }
                value={form.email}
              />
              <br/>
              <button
                onClick={sendOTP}
                className='bg-green-600 text-white p-1 rounded-md cursor-pointer m-2'
              >Send OTP</button>
            </form>
            :
            <form></form>
          }
        </div>
}
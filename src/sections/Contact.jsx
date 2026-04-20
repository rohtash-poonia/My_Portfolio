import React, { useRef, useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import AstraImg from '../assets/images/Astra.png'; 
import chargeUpSoundFile from '../assets/audio/charge-up.wav'; 
import Footer from './Footer'; 

const Contact = () => {
  const form = useRef();
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    const snd = new Audio(chargeUpSoundFile);
    snd.load();
    setAudio(snd);
  }, []);

  const playSound = () => {
    if (audio) {
      audio.currentTime = 0; 
      audio.volume = 0.3;    
      audio.play().catch(err => console.log("Sound error:", err));
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();
    playSound(); 

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
          alert("Message Sent! 🚀");
          form.current.reset();
      }, (error) => {
          alert("Error: " + error.text);
      });
  };

  return (
    <>
      <style>
        {`
          .contact-wrapper {
            min-height: 100vh;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
            position: relative;
            overflow: hidden;
            font-family: 'Segoe UI', sans-serif;
          }

          .stars-container {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 0;
          }

          .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: twinkle var(--duration) infinite ease-in-out;
          }

          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }

          .main-content {
            flex: 1;
            display: flex;
            align-items: center;
            /* Space between image and card */
            justify-content: space-between; 
            max-width: 1400px; /* Width bada di taaki corners tak ja sakein */
            width: 100%;
            z-index: 10;
            padding: 20px 80px; /* Side paddings for safe distance */
            margin-top: 20px;
          }

          .astra-image {
            width: 100%;
            max-width: 450px; /* Image ka size bada kar diya */
            filter: drop-shadow(0 0 30px rgba(56, 189, 248, 0.4));
            animation: float 5s ease-in-out infinite;
            /* Left side shift alignment */
            margin-left: -40px; 
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(-2deg); }
            50% { transform: translateY(-30px) rotate(2deg); }
          }

          .contact-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 25px;
            padding: 30px;
            width: 100%;
            max-width: 450px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            /* Extreme right shift alignment */
            margin-right: -20px; 
          }

          .contact-card h2 {
            font-size: 2.2rem;
            margin-bottom: 12px;
            background: linear-gradient(to right, #38bdf8, #fff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 800;
          }

          .input-style {
            width: 100%;
            padding: 12px;
            margin: 8px 0;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: white;
            outline: none;
            box-sizing: border-box;
            font-size: 1rem;
            transition: 0.3s;
          }

          .input-style:focus {
            border-color: #38bdf8;
            background: rgba(255, 255, 255, 0.12);
            box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
          }

          select.input-style option {
            background: #1B2735;
            color: white;
          }

          .btn-send {
            width: 100%;
            padding: 14px;
            margin-top: 15px;
            background: #38bdf8;
            border: none;
            border-radius: 12px;
            color: #000;
            font-weight: bold;
            cursor: pointer;
            transition: 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .btn-send:hover { 
            background: #fff; 
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(56, 189, 248, 0.5);
          }

          @media (max-width: 1100px) {
            .astra-image { max-width: 350px; margin-left: 0; }
            .main-content { padding: 20px 40px; }
          }

          @media (max-width: 900px) {
            .main-content { justify-content: center; }
            .astra-image { display: none; }
            .contact-card { margin-right: 0; }
          }
        `}
      </style>

      <div id="contact" className="contact-wrapper">
        <div className="stars-container">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="star" style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              '--duration': `${2 + Math.random() * 3}s`
            }} />
          ))}
        </div>

        <div className="main-content">
          {/* Image Badi ho gayi aur Left shift ho gayi */}
          <img src={AstraImg} alt="Astra" className="astra-image" />
          
          {/* Form Card Right shift ho gaya */}
          <div className="contact-card">
            <h2>Let's Connect</h2>
            <form ref={form} onSubmit={sendEmail}>
              <input type="text" name="from_name" placeholder="Full Name" className="input-style" required />
              <input type="email" name="from_email" placeholder="Email Address" className="input-style" required />
              
              <select name="service" className="input-style" defaultValue="" required>
                <option value="" disabled>Select Service</option>
                <option value="Web Development">Web Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Other">Other</option>
              </select>

              <textarea name="message" placeholder="Message..." rows="4" className="input-style" style={{resize: 'none'}} required></textarea>
              
              <button 
                type="submit" 
                className="btn-send"
                onMouseEnter={playSound}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
import { useEffect, useRef, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import styles from "../style/Home.module.css";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const navigate = useNavigate();
    const submitRef = useRef();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            navigate('/quiz', { state: { email: user.email } });
        }
    }, [navigate]);

    const saveUser = async (e) => {
        e.preventDefault();
        submitRef.current.innerHTML = "Saving...";
        await setDoc(doc(db, "users", email), {
            name,
            email,
            phone,
            age
        }, { merge: true });
        localStorage.setItem('user', JSON.stringify({ name, email }));
        navigate('/quiz', { state: { email } });
    };

    return (
        <div className={styles.main}>
            <h1>Student Profile</h1>
            <h2>Enter your details</h2>
            <form>
                <label htmlFor="name">Name</label>
                < input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
                < label htmlFor="email" > Email</label >
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="xyz@abc.com" required />
                <label htmlFor="phone">Phone</label>
                <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" required />
                <label htmlFor="age">Age</label>
                <input type="text" id="age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Your age" required />
                <button onClick={saveUser} ref={submitRef}>Continue</button>
            </form >
        </div >
    );
}

export default Home;
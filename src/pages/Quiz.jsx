import { useContext, useEffect, useState } from "react";
import styles from "../style/Quiz.module.css";
import { collection, updateDoc, getDocs, doc } from "firebase/firestore";
import { db } from "../firebase";
import Question from "../components/Question";
import { ThreeDots } from "react-loader-spinner";
import NotyfContext from "../NotyfContext";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();
    const notyf = useContext(NotyfContext);
    const refresh = useRef(0);
    const user = useRef();

    useEffect(() => {
        let localUser = JSON.parse(localStorage.getItem("user"));
        if (!localUser) {
            navigate("/");
        }
        user.current = localUser;
        const getUserAnswers = async () => {
            const userRef = doc(db, "users", user.current.email);
            const userSnap = await getDocs(userRef);
            const userData = userSnap.data();
            if (userData.answers) {
                let ans = {};
                userData.answers.forEach((answer, index) => {
                    ans[index] = answer.answer;
                });
                setAnswers(ans);
            }
        }
        const getQuestions = async () => {
            const questionsCol = collection(db, "questions");
            const questionSnapshot = await getDocs(questionsCol);
            const questionList = questionSnapshot.docs.map(doc => ({ data: doc.data(), id: doc.id }));
            setQuestions(questionList);
        }
        getQuestions();
        const ans = JSON.parse(sessionStorage.getItem("answers"));
        if (ans) {
            setAnswers(ans);
        }
    }, [])

    const submit = async () => {

        if (Object.keys(answers).length === 0) {
            notyf.error("Please answer all the questions.");
            setCurrent(0);
            return;
        }
        for (let i = 0; i < questions.length; i++) {
            if (!answers[i] || answers[i] === "" || answers[i].length === 0) {
                notyf.error("Please answer all the questions.");
                setCurrent(i);
                return;
            }
        }

        let ans = [];
        Object.keys(answers).forEach(key => {
            ans.push({
                question: questions[key].data.question,
                answer: answers[key],
                id: questions[key].id
            })
        });

        const userRef = doc(db, "users", user.current.email);

        await updateDoc(userRef, {
            answers: ans
        })

        notyf.success("Answers submitted successfully.");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
    };


    useEffect(() => {
        if (refresh.current > 0) {
            sessionStorage.setItem("answers", JSON.stringify(answers));
        }
        refresh.current++;
    }, [answers]);



    return (
        <>
            <main className={styles.main}>
                <div className={styles.mainHead}>
                    <h1>Questionnaire</h1>
                </div>
                <section className={styles.quesWrap}>
                    {questions.length > 0 ? (
                        <>
                            <Question question={questions[current]} index={current} setAnswers={setAnswers} answers={answers} />
                            <div className={styles.spacer} />
                        </>
                    ) : (
                        <div style={{ display: "block", margin: "auto" }}>
                            <ThreeDots
                                height="20"
                                width="50"
                                radius="14"
                                color="white"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClassName=""
                                visible={true}
                            />
                        </div>
                    )}
                    <div className={styles.progress}>
                        <div className={styles.progressBar} style={{ width: `${questions.length ? ((current + 1) / questions.length * 100) : 0}%` }}></div>
                    </div>
                    <div className={styles.btnWrap}>
                        {current > 0 && <button tabIndex={-1} onClick={() => setCurrent((current) => current - 1)}>Previous</button>}
                        {current < questions.length - 1 && <button onClick={() => setCurrent((current) => current + 1)}>Next</button>}
                        {current === questions.length - 1 && <button className={styles.submit} onClick={submit}>Submit</button>}
                    </div>
                </section>
            </main>
        </>
    );

};

export default Quiz;
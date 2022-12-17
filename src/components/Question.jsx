import styles from "../style/Quiz.module.css";

const Question = ({ question, index, setAnswers, answers }) => {

    return (
        <div className={styles.ques}>
            <h2>Q{index + 1}. {question.data.question}</h2>
            <div className={styles.options}>
                {question.data.type === 2 ? question.data.options.map((option) => (
                    <div className={`${styles.option} ${answers[index] ? answers[index].includes(option) ? styles.selected : "" : ""}`} onClick={() => {
                        setAnswers((current) => {
                            if (current[index] && current[index].includes(option)) {
                                return { ...current, [index]: current[index].filter((item) => item !== option) };
                            }
                            return { ...current, [index]: [...(current[index] || []), option] };
                        })
                    }} key={option}>
                        {option}
                    </div>
                )) :
                    <textarea placeholder="Enter your answer in a detailed manner." value={answers[index] || ""} onChange={(e) => {
                        setAnswers((current) => {
                            return { ...current, [index]: e.target.value };
                        });
                    }} required rows={10} />
                }
            </div>
        </div >
    );
}

export default Question;
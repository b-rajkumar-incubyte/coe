import React, { useState } from "react";

interface CounterProps extends React.PropsWithChildren {
    start?: number;
}

function Counter(props: CounterProps) {
    const [count, setCount] = useState(props.start || 0);

    function incrementCount() {
        setCount(count + 1);
    }

    function decrementCount() {
        setCount(count - 1);
    }

    return (<div>
        <button onClick={incrementCount}>+</button>
        <div> Count: {count} </div>
        <button onClick={decrementCount}>-</button>
        </div>);
}

export default Counter;
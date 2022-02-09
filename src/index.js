import React from "react";
import { render } from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { scaleLinear, scaleBand } from "@visx/scale";

const client = new ApolloClient({
  uri: "https://fakerql.goosfraba.ro/graphql",
  cache: new InMemoryCache(),
});

export const GET_LAUNCHES = gql`
  query GetRates {
    allPosts(count: 100) {
      id
      title
      body
      published
      createdAt
      author {
        id
        firstName
        lastName
        avatar
      }
    }
  }
`;

function ExchangeRates() {
  return <div></div>;
}

function App() {
  return (
    <div>
      <h2>My first Chart</h2>
      <BarGraph />
      <ExchangeRates />
    </div>
  );
}

function BarGraph(props) {
  let { data } = useQuery(GET_LAUNCHES);

  if (!data) {
    return <div>it s ok</div>;
  }

  console.log(data);
  const months = () => {
    const arrayMonths = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    data.allPosts.forEach((element) => {
      const labelName = new Date(parseInt(element.createdAt)).toLocaleString(
        "default",
        { month: "long" }
      );
      ++arrayMonths[labelName];
    });
    return Object.entries(arrayMonths);
  };

  let myArray = [];
  months().forEach((x) => {
    myArray = [...myArray, { letter: x[0], frequency: x[1] }];
  });

  console.log(myArray);

  data = myArray;

  const width = 500;
  const height = 500;
  const margin = { top: 20, bottom: 20, left: 20, right: 20 };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const x = (d) => d.letter;
  const y = (d) => +d.frequency * 100;

  const xScale = scaleBand({
    range: [0, xMax],
    round: true,
    domain: data.map(x),
    padding: 0.4,
  });
  const yScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(...data.map(y))],
  });

  const compose = (scale, accessor) => (data) => scale(accessor(data));
  const xPoint = compose(xScale, x);
  const yPoint = compose(yScale, y);

  return (
    <svg width={width} height={height}>
      {data.map((d, i) => {
        const barHeight = yMax - yPoint(d);
        return (
          <Group key={`bar-${i}`}>
            <Bar
              x={xPoint(d)}
              y={yMax - barHeight}
              height={barHeight}
              width={xScale.bandwidth()}
              fill="#fc2e1c"
            />
            <p> AAAA </p>
          </Group>
        );
      })}
    </svg>
  );
}

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

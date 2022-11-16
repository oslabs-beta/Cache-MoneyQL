import React, { useState, useEffect } from 'react';
import BarChart from './BarChart';
import LineChart from './LineChart';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Navigate } from 'react-router-dom';
import QueueVisualizer from './QueueVisualizer';
import { shadows } from '@mui/system';

import '../styles/Demo.scss';

const Demo = () => {
  // const [queryData, setQueryData] = useState([]);

  //state for the GraphQL query result once the fetch is down
  const [queryResult, setQueryResult] = useState('');

  //query string that is displayed in GraphQL format
  const [queryString, setQueryString] = useState('');

  //Array storing the linkedlist data use to display our linked list
  const [llData, setLLData] = useState([]);

  const [removedNode, setRemovedNode] = useState({ num: 0, latency: 0 });
  const [currGroupSize, setCurrGroupSize] = useState(0);

  const [queryGraphQLString, setQueryGraphQLString] = useState(
    '{ clients { id name email phone } }'
  );
  const [queryTime, setQueryTime] = useState(0);
  const [queryTimeArray, setQueryTimeArray] = useState([
    { latency: 0, cached: false },
  ]);

  const [clientChecked, setClientChecked] = useState(false);
  const [clientIdChecked, setClientIdChecked] = useState(true);
  const [clientNameChecked, setClientNameChecked] = useState(true);
  const [clientEmailChecked, setClientEmailChecked] = useState(true);
  const [clientPhoneChecked, setClientPhoneChecked] = useState(true);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Query Time in Milliseconds',
        data: queryTimeArray.latency,
        backgroundColor: ['blue'],
        borderColor: 'black',
        borderWidth: 2,
      },
    ],
    options: {
      indexAxis: 'y',
    },
  });

  useEffect(() => {
    const string = `{ clients { ${clientIdChecked ? 'id' : ''}${
      clientNameChecked ? ' name' : ''
    }${clientEmailChecked ? ' email' : ''}${
      clientPhoneChecked ? ' phone' : ''
    } } }`;
    //string.replaceAll("  ", " ");
    setQueryGraphQLString(string);
  }, [
    clientChecked,
    clientIdChecked,
    clientNameChecked,
    clientEmailChecked,
    clientPhoneChecked,
  ]);

  const chartLatency = () => {
    let latencyArray = queryTimeArray.map((el) => el.latency);
    let result = latencyArray.slice(1);
    return result;
  };

  useEffect(() => {
    let arr = [];

    setChartData({
      labels: queryTimeArray
        .map((data, i) => {
          return !data.cached ? 'Uncached Query' : `Cached Query`;
        })
        .slice(1),
      datasets: [
        {
          axis: 'y',
          label: 'Query Time in Milliseconds',
          data: chartLatency(),
          fill: true,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
          ],

          borderColor: 'black',
          borderWidth: 2,
        },
      ],
    });
  }, [queryTimeArray]);

  const fetchData = async () => {
    const startTime = performance.now();
    await fetch('http://localhost:3000/cacheMoney', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: queryGraphQLString,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const endTime = (performance.now() - startTime).toFixed(2); // records end time for front-end latency measure
        setLLData(data.queue); // updates state linked list object
        if (data.removedNode) {
          setRemovedNode(data.removedNode);
        }
        setCurrGroupSize(data.currGroupSize);
        setQueryTime(endTime);
        //setQueryTime(data.latency.toFixed(2));

        setQueryTimeArray([
          ...queryTimeArray,
          { latency: endTime, cached: data.cached },
        ]); // updates data points for charts
        console.log(JSON.stringify(data.data, null, 2));
        setQueryResult(JSON.stringify(data.data, null, 2));
      });
  };

  const displayData = () => {
    return queryData.map((item, i) => {
      return <div key={i}>{JSON.stringify(item)}</div>;
    });
  };
  const displayQueryTimeArray = () => {
    return queryTimeArray.map((item, i) => {
      return <div key={i}>{item.latency}</div>;
    });
  };

  const handleQuery = () => {
    fetchData();
  };

  const handleUpload = () => {
    setQueryString(`{ clients { id name email phone } }`);
  };

  const testQuery = () => {
    if (clientChecked) {
      return (
        <Container>
          <span style={{ margin: 0, paddingTop: 20 }}>&#123;</span>
          <br></br>
          <span>&nbsp;&nbsp;clients &#123;</span>
          <br></br>
          {clientIdChecked && (
            <span sx={{ margin: 0 }}>&nbsp;&nbsp;&nbsp;&nbsp;id<br></br></span>
          )}
          {clientNameChecked && (
            <span sx={{ margin: 0 }}>&nbsp;&nbsp;&nbsp;&nbsp;name<br></br></span>
          )}
          {clientEmailChecked && (
            <span sx={{ margin: 0 }}>&nbsp;&nbsp;&nbsp;&nbsp;email<br></br></span>
          )}
          {clientPhoneChecked && (
            <span sx={{ margin: 0 }}>&nbsp;&nbsp;&nbsp;&nbsp;phone<br></br></span>
          )}
          <span sx={{ margin: 0 }}>&nbsp;&nbsp; &#125;</span>
          <br></br>
          <span sx={{ margin: 0 }}>&#125;</span>
        </Container>
      );
    }
  };

  return (

    <div className='demoDiv'>
      <Grid container spacing={5} alignItems='center' justifyContent='center'>
        <Grid item>
          <Box display='flex' flexDirection='column' sx={{ boxShadow: 24 }}>
            <Container id='queryString' sx={{border: 'black 2px', borderTopLeftRadius:10, borderTopRightRadius:10, backgroundColor: '#121F4E', padding:2, color: '#F0F3BD' }}>
              <input
                type='checkbox'
                onChange={() =>
                  clientChecked
                    ? setClientChecked(false)
                    : setClientChecked(true)
                }
                id='clients'
                name='clients'
                value='clients'
              />
              <label htmlFor='clients'> Clients</label>
              <Container >
                {clientChecked === true && (
                  <div>
                    <input
                      type='checkbox'
                      onChange={() =>
                        clientIdChecked
                          ? setClientIdChecked(false)
                          : setClientIdChecked(true)
                      }
                      checked={clientIdChecked}
                      id='clients'
                      name='clientId'
                      value='clientId'
                    />
                    <label htmlFor='clientId'> ID</label>
                    <input
                      type='checkbox'
                      onChange={() =>
                        clientNameChecked
                          ? setClientNameChecked(false)
                          : setClientNameChecked(true)
                      }
                      checked={clientNameChecked}
                      id='clientName'
                      name='clientName'
                      value='clientName'
                    />
                    <label htmlFor='clientName'> Name</label>
                    <input
                      type='checkbox'
                      onChange={() =>
                        clientEmailChecked
                          ? setClientEmailChecked(false)
                          : setClientEmailChecked(true)
                      }
                      checked={clientEmailChecked}
                      id='clientEmail'
                      name='clientEmail'
                      value='clientEmail'
                    />
                    <label htmlFor='clientEmail'> Email</label>
                    <input
                      type='checkbox'
                      onChange={() =>
                        clientPhoneChecked
                          ? setClientPhoneChecked(false)
                          : setClientPhoneChecked(true)
                      }
                      checked={clientPhoneChecked}
                      id='clientPhone'
                      name='clientPhone'
                      value='clientPhone'
                    />
                    <label htmlFor='clientPhone'> Phone</label>
                  </div>
                )}
              </Container>
            </Container>
            <Container
              sx={{
                overflow: 'auto',
                height: 300,
                width: 500,
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'flex-start',
                color: '#9C528B',
                
              }}
            >
        
              <Typography style={{fontSize: 20}}> {testQuery()} </Typography>
            </Container>
            {/* <Button
              variant='contained'
              color='info'
              size='medium'
              id='uploadButton'
              onClick={handleUpload}
            >
              Upload Query
            </Button> */}
            <Button
              variant='contained'
              size='large'
              id='queryButton'
              onClick={handleQuery}
              sx ={{ backgroundColor: '#121F4E'}}
            >
              Run Query
            </Button>
          </Box>
        </Grid>

        <Grid item sx={{padding: 0}}>
          <Container sx={{boxShadow: 24, margin: 0, padding: '0px !important', border: 'black 2px', borderTopLeftRadius:10, borderTopRightRadius:10, backgroundColor: '#121F4E', paddingLeft: 0, paddingRight:0, color: 'white'}}>
            <Typography variant='h4' sx={{fontFamily: 'Georgia, serif', justifyContent: 'center', padding: 1, display: 'flex'}}>Query Result</Typography>
            <Container
              sx={{
                overflow: 'auto',
                height: 300,
                width: 600,
                backgroundColor: 'black',
                display: 'flex',
                justifyContent: 'flex-start',
                borderRadius: 5,
              }}
              className='queryResult'
            >
              <p style={{ fontWeight: 700, color: 'white', fontSize: 18 }}>
                {' '}
                {queryResult}{' '}
              </p>
            </Container>
            <Box sx={{paddingTop: 1, display: 'flex', justifyContent: 'space-between'}}>
              <Typography variant='span' sx={{fontFamily: 'Georgia, serif', fontSize: 25, paddingLeft: 3}}>Query Time:</Typography>
              <Typography variant='span' sx={{fontFamily: 'Georgia, serif', fontSize: 25, paddingRight: 3, color:'red'}}>{queryTime}<span style={{fontSize:15}}>ms</span></Typography>
            </Box>
            <Container sx={{paddingBottom: 1, display: 'flex', justifyContent: 'space-between'}}>
              <Typography variant='span' sx={{fontFamily: 'Georgia, serif', fontSize: 25}}>Cache Hit:</Typography>
              <Typography variant='span' sx={{fontFamily: 'Georgia, serif', fontSize: 25, color: 'red'}}>{queryTimeArray[queryTimeArray.length - 1].cached ? 'Hit' : 'Miss'}</Typography>
            </Container>
          </Container>
          
        </Grid>
      </Grid>

      <Grid
        container
        alignItems='center'
        justifyContent='center'
        flex
        sx={{ pt: 5 }}
      >
        {/* <Grid item>
          <Box justifyContent='center' sx={{ width: 500 }}>
            <Typography variant='h4'>Query Time: {queryTime}ms</Typography>
          </Box>
        </Grid> */}
        
        <Grid item sx={{ width: 900, border: 'black 1px solid', borderTopLeftRadius:10, borderTopRightRadius:10, backgroundColor: 'white', padding:2, color: '#121F4E', boxShadow: 24}}>
          <Typography variant='h3' sx={{fontFamily: 'Georgia, serif', textAlign: 'center'}}> Query Cache Performance Chart </Typography>
          <Box className='barChartContainer' justifyContent='center'>
            <BarChart style={{ width: 600 }} chartData={chartData} />
          </Box>
        </Grid>

        {/* <Grid item sx={{ width: 700 }}>
          <Box className='lineChartContainer' justifyContent='center'>
            <LineChart style={{ width: 600 }} chartData={chartData} />
          </Box>
        </Grid> */}
      </Grid>
      <QueueVisualizer 
        queue={llData}
        removedNode={removedNode}
        currGroupSize={currGroupSize}
      />
    </div>
  );
};

export default Demo;

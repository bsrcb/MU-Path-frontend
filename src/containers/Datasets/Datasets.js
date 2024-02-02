import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import fei_paper from './fei_paper.jpg'

export default function Datasets() {
    const download = (file_name) => {
        console.log("github1")
        window.open(process.env.REACT_APP_API +
        "/download/?file=" +
        file_name, '_blank')
        
      }
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="160"
        image = {fei_paper}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
        Paper:Identifying Genes and Their Interactions from Pathway Figures and Text in Biomedical Articles
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
        </Typography> */}
      </CardContent>
      <CardActions>
        <Button size="small" onClick={()=>download("validation.zip")}>Download the Datasets</Button>
        <Button size="small" onClick={()=>{window.open("https://ieeexplore.ieee.org/abstract/document/9669391")}}>Learn More</Button>
      </CardActions>
    </Card>
  )
 
}

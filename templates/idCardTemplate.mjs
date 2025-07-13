export const idCardTemplate = `<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>

    <div class="card">
        <div class="card-title">
            <h1>Volunteer</h1>
            <h3>DEDICATED TO DISASTER RELIEF</h3>
        </div>
        <div class="image-cropper">
            <img src="{{photo}}" alt="photo" class="rounded" height="100%" width="100%">
        </div>
        <div class="details">
            <h2>{{name}}</h2>
            <hr>
            <h3>{{SBF_id}}</h3>
            <hr>
        </div>
            <div class="more-details">
                <div>
                    <p class="grey">Blood Group</p>
                    <p class="black">{{blood_group}}</p>
                </div>
                <div>
                    <p class="grey">State</p>
                    <p class="black">{{state}}</p>
                </div>
               
                <div>
                    <p class="grey">Emergency Contact</p>
                    <p class="black">{{contact_no}}</p>
                    <p class="greySmall">Valid Upto <span class="blackSmall">{{valid_upto}}</span> </p>
               
                </div>
                <div>
                    <p class="grey">District</p>
                    <p class="black">{{district}}</p>
                </div>
               

                 </div>
        <img src="{{sign}}" alt="sign" width="100px" height="80px" class="sign" >
        <div class="footer">
            <hr>
            <div class="footerImages">
                <div class="image-cropper-rec">
                    <img src={{logo}} alt="SBF logo"  height="70px" width="100px">
                </div>
                
                <img src={{vision}} alt=" Vision 2026 logo"  height="50px">
            </div>
            <p class="orange">SOCIETY FOR BRIGHT FUTURE</p>
            <p class="black2">E-89, 1st Floor, AFE, Jamia Nagar, New Delhi,110025</p>
            <p class="black2">info@sbfindia.org, www.sbfindia.org</p>

        </div>
    </div>

</body>

</html>

<style>
    .orange{
        color: orange;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        font-size: 20px;
        text-align: center;
        margin: 0;
    }
    .footer{
        position: relative;
    top: 120px;
    width: 330px;
    }
    .footerImages{
        display: flex;
        align-items: center;

    }
    .card{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .card-title{
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 1px;
        background-color: #ff4646;
        color: white;
        padding: 10px 10px 40px 10px;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;


    }
    .details{
        width: 330px;
        line-height: 1px;
        position: relative;
        text-align: center;
        top: 120px;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    }
    .wrapper{
        display: flex;
        position: relative;
        width: 330px;
    }
    .more-details{
        width: 330px;
        line-height: 1px;
        position: relative;
        top: 120px;
        display: grid;
        grid-template-columns: 1.2fr 2fr;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    }
    .image-cropper {
        width: 150px;
    height: 150px;
    position: absolute;
    overflow: hidden;
    border-radius: 50%;
    top: 100px;
        
    
    }
    .image-cropper-rec {
        object-fit: fill;
    height: 75px;
    width: 100px;

        
    
    }
    .sign{
        position: fixed;
    right: 14em;
    top: 22em;
    }
    .grey{
        color: gray;
        font-size: 13px;
    }
    .black{
        color: rgb(16, 16, 16);
        font-size: 15px;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    }
    .greySmall{
        color: gray;
        font-size: 11px;
    }
    .blackSmall{
        color: red;
        font-size: 13px;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    }
    .black2{
        margin: 0;
        color: rgb(16, 16, 16);
        text-align: center;
        font-size: 15px;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    }

    img {
        display: inline;
        margin: 0 auto;
        
        object-fit: cover;
    }
</style>`
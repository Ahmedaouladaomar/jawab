export default function generateHtml(code: number){
    return `Hello, 
            <br><br>
            Here is your verification code <strong>${code}</strong>, keep in mind the code expires in 5 minutes.
            <br><br>
            Regards,
            <br>Jawab team`;
}
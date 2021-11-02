# Path for the installed speedtest directory
$speedtestLocation = ""

# Path and name of the output file (speedtest-results.json)
# Must be set to match the location in App.js
$speedtestResults = ""

# Set the desired speedtest server
$speedtestServer = 0

$temp = ".\temp.json"

Set-Location $speedtestLocation
.\speedtest.exe --accept-license --accept-gdpr -s $speedtestServer -f json-pretty >> $temp

# If file does not exist, start it with an opening bracket
if (-not(Test-path $speedtestResults -PathType leaf))
{
    "[" | Out-File -Encoding utf8 -FilePath $speedtestResults
}
else # Change ']' from the end of the file to a comma
{
    $stream = [IO.File]::OpenWrite($speedtestResults)
    $stream.SetLength($stream.Length - 4)
    $stream.Close()
    $stream.Dispose()
    "," | Out-File -Append -Encoding utf8 -FilePath $speedtestResults
}

# Extract the most interesting information
$result = Get-Content $temp | ConvertFrom-Json
@"
{
    "timestamp": "$($result.timestamp)",
    "ping": {
        "latency": $($result.ping.latency)
    },
    "download": {
        "bandwidth": $($result.download.bandwidth)
    },
    "upload": {
        "bandwidth": $($result.upload.bandwidth)
    },
    "result": {
        "url": "$($result.result.url)"
    }
}
]
"@ | Out-File -Append -Encoding utf8 -FilePath $speedtestResults

Remove-Item $temp

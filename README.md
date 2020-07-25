# React native parse string
Parse any regex expression in your string with React Native.

## Basic usage
```javascript
<ParseString
    rules={[
        {
            regex: /(#[\p{L}\w]+)/igu,
            render: (value, index) => <Link to={`/tag/${value.substr(1)}`} key={index}>{value}</Link>
        },
        {
            regex: /(@[a-z\d-]+)/ig,
            render: (value, index) => <Link to={`/${value.substr(1)}`} key={index}>{value}</Link>
        }
    ]}
>
    We are a group of #people helping people reach whatever they dream of.
    I'm asking @facebook to join us!
</ParseString>
```

**More to come...**
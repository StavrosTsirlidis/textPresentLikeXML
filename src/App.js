import React from 'react';
import useFile from 'use-file';
import './App.css';

const App = () => {

  // uses useFile hook to load a file and return it like text string
  const { result, reader } = useFile();
  const readFile = (e) => {
    const fileRead = e.currentTarget.files;

    if ((fileRead.length > 0) && (fileRead[0].type === 'text/plain')) {
      reader.readAsText(fileRead[0]);
    }
    else return null
  }

  //Takes text result string from loaded file and makes it to an array with objects
  const xmlConverter = (text) => {

    const personRegex = /P\|/g;
    const childRegex = /F\|/g;
    const endSplitRegex = /\r?\n/;

    //Splits the main string to persons with children and arranged in array with objects, arranged the informtion for each person
    //First reduce splits the string in array of persons and including the children for each person like elements of strings
    const personChildrenArray = text.split(personRegex).reduce((result, value, index, array) => {
      if (value) {
        result.push(value.split(childRegex))
      }
      console.log(result);
      return result;
    }, []).reduce((result, value, index, array) => {
      //goes through each person and arranged the string in a carrect person object

      if (value) {
        const personClean = value.reduce((result, value, index, array) => {
          //looks for first postion in the array, thats the person otherwise its children
          if (index === 0) {
            const splitValue = value.split(endSplitRegex);
            const person = splitValue.reduce((result, value, index, array) => {
              //looks for first postion in the array, thats the persons name
              if (index === 0) {
                let splitValue = value.split('|');
                result.push({ firstName: splitValue[0], lastName: splitValue[1] });
              }
              if (value.charAt(0) === 'T') {
                let splitValue = value.split('|');
                splitValue.shift();
                result.push({ phone1: splitValue[0], phone2: splitValue[1] });
              }
              if (value.charAt(0) === 'A') {
                let splitValue = value.split('|');
                splitValue.shift();
                result.push({ adress: splitValue[0], city: splitValue[1], zip: splitValue[2] });
              }
              return result;
            }, [])
            const flatPerson = Object.assign(...person);
            result.push({ Person: flatPerson });
          }
          else {
            const splitValue = value.split(endSplitRegex);

            const childPerson = splitValue.reduce((result, value, index, array) => {
              //looks for first postion in the array, thats the persons name
              if (index === 0) {
                let splitValue = value.split('|');
                result.push({ firstName: splitValue[0], birthday: splitValue[1] });
              }

              if (value.charAt(0) === 'T') {
                let splitValue = value.split('|');
                splitValue.shift();
                result.push({ phone1: splitValue[0], phone2: splitValue[1] });
              }

              if (value.charAt(0) === 'A') {
                let splitValue = value.split('|');
                splitValue.shift();
                result.push({ adress: splitValue[0], city: splitValue[1], zip: splitValue[2] });
              }
              return result;
            }, [])

            const flatChild = Object.assign(...childPerson);
            result.push({ Child: flatChild });
          }
          return result;
        }, []);

        result.push({
          Person: personClean[0].Person,
          Children: personClean.reduce((result, value, index, array) => {
            if (!value.Person) {
              result.push(value);
            }
            return result
          }, [])
        });
      }
      return result;
    }, []);
    return personChildrenArray
  }
  //renders a result that looks like XML possible that is possible to copy and use
  return (
    <div className="app-root">
      <div className="app-container">
        <h1 className="app-h1">Text representet like XML </h1>
        <div className="input-format-box">
          <h3 className="app-h3"> Input format:</h3>
          <div>
            <p>P|firstname|lastname</p>
            <p>T|mobile|fixed number</p>
            <p>A|street|city|postal code</p>
            <p>F|name|year of birth</p>
            <p>P can be followed by T, A and F</p>
            <p>F can be followed by T och A</p></div>
          <input type="file" onChange={readFile} />
        </div>

        <h3 className="app-h3">Input text</h3>
        {result}
        <h3 className="app-h3">Output xml</h3>
        {xmlConverter(result).length > 0 &&
          <div>{`<?xml version=1.O encoding="UTF-8"?>`}
            <div>{`<people>`}
              <div>{xmlConverter(result).map((object, i) => {
                return (
                  <div key={i}>
                    {
                      object.Person &&
                      <div className='step-in'>
                        {`<person>`}
                        {object.Person.firstName &&
                          <div className='step-in'>{`<firstName>`}{object.Person.firstName}{`</firstName>`}</div>}
                        {object.Person.lastName &&
                          <div className='step-in'>{`<lastName>`}{object.Person.lastName}{`</lastName>`}</div>}
                        {(object.Person.adress || object.Person.city || object.Person.zip) &&
                          <div className='step-in'>
                            {`<address>`}
                            {object.Person.adress &&
                              <div className='step-in'>{`<street>`}{object.Person.adress}{`</street>`}</div>}
                            {object.Person.city &&
                              <div className='step-in'>{`<city>`}{object.Person.city}{`</city>`}</div>}
                            {object.Person.zip &&
                              <div className='step-in'>{`<zip>`}{object.Person.zip}{`</zip>`}</div>}
                            {`</address>`}
                          </div>
                        }
                        {(object.Person.phone1 || object.Person.phone2) &&
                          <div className='step-in'>
                            {`<phones>`}
                            {object.Person.phone1 &&
                              <div className='step-in'>{`<phone1>`}{object.Person.phone1}{`</phone1>`}</div>}
                            {object.Person.phone2 &&
                              <div className='step-in'>{`<phone2>`}{object.Person.phone2}{`</phone2>`}</div>}
                            {`</phones>`}
                          </div>
                        }
                        {object.Children.length > 0 &&
                          <div className='step-in'>
                            {`<family>`}
                            {object.Children.map((child, i) => {
                              return (
                                <div className='step-in' key={i}>
                                  {`<child>`}
                                  {child.Child.firstName &&
                                    <div className='step-in'>{`<name>`}{child.Child.firstName}{`</name>`}</div>}
                                  {child.Child.birthday &&
                                    <div className='step-in'>{`<birthYear>`}{child.Child.birthday}{`</birthYear>`}</div>}
                                  {(child.Child.Adress || child.Child.city || child.Child.zip) &&
                                    <div className='step-in'>
                                      {`<address>`}
                                      {child.Child.adress &&
                                        <div className='step-in'>{`<street>`}{child.Child.adress}{`</street>`}</div>}
                                      {child.Child.city &&
                                        <div className='step-in'>{`<city>`}{child.Child.city}{`</city>`}</div>}
                                      {child.Child.zip &&
                                        <div className='step-in'>{`<zip>`}{child.Child.zip}{`</zip>`}</div>}
                                      {`</address>`}
                                    </div>
                                  }
                                  {(child.Child.phone1 || child.Child.phone2) &&
                                    <div className='step-in'>
                                      {`<phones>`}
                                      {child.Child.phone1 &&
                                        <div className='step-in'>{`<phone1>`}{child.Child.phone1}{`</phone1>`}</div>}
                                      {child.Child.phone2 &&
                                        <div className='step-in'>{`<phone2>`}{child.Child.phone2}{`</phone2>`}</div>}
                                      {`</phones>`}
                                    </div>
                                  }
                                  {`<child>`}
                                </div>
                              )
                            })}
                            {`</family>`}
                          </div>
                        }
                        {`</person>`}
                      </div>
                    }
                  </div>
                )
              })}</div>
              {`</people>`}
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default App;

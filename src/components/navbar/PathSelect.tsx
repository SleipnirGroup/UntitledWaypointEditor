import React, { Component } from 'react';
import Select, { OptionProps, components } from 'react-select';
import DocumentManagerContext, { DocumentManager } from '../../document/DocumentManager';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import styles from './Navbar.module.css';
import { IHolonomicPathStore } from '../../document/DocumentModel';
import { observer } from 'mobx-react';

type Props = {};

type State = {};

type PathOption = {
  uuid: string
};

interface PathOptionProps extends OptionProps<PathOption> {};
type PathOptionState = {};
// a wrapper because react-select passes parameters to render
const PathOptionContainer = (props: OptionProps<PathOption>) => {
    return <PathOptionInner {...props}></PathOptionInner>
}

class PathOptionInner extends Component<PathOptionProps, PathOptionState>{
  static contextType = DocumentManagerContext;
  declare context: React.ContextType<typeof DocumentManagerContext>;
  state = {};

  render() {
      console.log(this.props)
    return (
        <DocumentManagerContext.Consumer>{(context:DocumentManager) =>(
      <div className="PathOptionContainer">
        <components.Option {...this.props}>
         {this.props.children}         
              
            <span><button
                  className="renameButton small"
                  onClick={(event) => {
                      event.stopPropagation();
                      context.model.pathlist.paths.get(this.props.data.uuid)?.setName("rename");
                  }}
                >
                  <FontAwesomeIcon
                  className="renameIcon"
                  icon={faEdit}
                />
                </button>
                <button
                  className="deleteButton small"
                  onClick={(event) => {
                  }}
                >
                  <FontAwesomeIcon
                  className="deleteIcon"
                  icon={faTrash}
                />
                </button></span>
          
          
        </components.Option>
      </div>
    )}</DocumentManagerContext.Consumer>)
  }
}
//  (props: OptionProps<PathOption>) => {
//   static contextType = DocumentManagerContext;
//   const context!: React.ContextType<typeof DocumentManagerContext>;
//   return (
//     <div className="optionContainer">
//       <components.Option {...props}>
//         {props.children}
//         <button
//           className="renameButton"
//           onClick={(event) => {
//             // let newName = prompt('Enter new name: ');
//             // if (newName !== null) {
//               console.log('rename');
//             // }
//           }}
//         >
//           <FontAwesomeIcon
//           className="renameIcon"
//           icon={faEdit}
//         />
//         </button>
//         <button
//           className="deleteButton"
//           onClick={(event) => {
//           }}
//         >
//           <FontAwesomeIcon
//           className="deleteIcon"
//           icon={faTrash}
//         />
//         </button>
//       </components.Option>
//     </div>
//   );
// };
class PathSelect extends Component<Props, State> {
  static contextType = DocumentManagerContext;
  context!: React.ContextType<typeof DocumentManagerContext>;
  state = {};

  render() {
    return (
        <span className={styles.PathChooserContainer}>
          <Select<PathOption>
                  closeMenuOnSelect={false}
                  isSearchable={false}
                  components={{ Option: PathOptionContainer }}
                  styles={{
                    container: (baseStyles, state) => ({
                        ...baseStyles,
                       margin: '5px'
                      }),
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      backgroundColor: '#7D73E7',
                      borderWidth: 0,
                      borderRadius: 6,
                      width: 200,
                      height: 20
                    }),
                    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                      return {
                        ...styles,
                        backgroundColor:
                          isDisabled ? undefined
                            : isSelected
                              ? 'var(--select-yellow)' 
                                : isFocused
                                  ? 'var(--darker-purple)' : undefined,
                        color: 'white',
                        cursor: isDisabled ? "not-allowed" : "default",
                        marginLeft: 4,
                        marginRight: 0,
                        marginBottom: 4,
                        marginTop: 4,
                        width: 192,
                        height:50,
                        borderRadius: 5,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems:'center',
                        zIndex:1000,
                  
                        ":active": {
                          ...styles[":active"],
                          backgroundColor: isDisabled ? undefined
                            : isSelected ? 'var(--select-yellow)' : 'var(--darker-purple)'
                        }
                      };
                    },
                    singleValue: (styles, { data }) => ({ ...styles, color: 'white' }),
                    menu: base => ({
                      ...base,
                      backgroundColor: 'var(--accent-purple)'
                    }),
                    placeholder: base => ({
                        ...base,
                        color:'white'
                    })
                  }}
                  onChange={pathOption => {if (pathOption?.uuid !== null && pathOption?.uuid !== undefined) this.context.model.pathlist.setActivePathUUID(pathOption.uuid);}}
                  options={Array.from(this.context.model.pathlist.paths.keys())
                             .map(key => this.context.model.pathlist.paths.get(key))
                             .filter(path => (path != null && path != undefined && path.uuid != null && path.uuid!=undefined))
                            .map((path)=>({uuid: (path?.uuid || '')}))}
                  // value={{uuid: this.context.model.pathlist.paths.get('one')?.uuid}}
                  getOptionLabel={(option) => {
                    const path = this.context.model.pathlist.paths.get(option.uuid);
                    if (path !== undefined && path.name !== undefined) {
                      return path.name;
                    } else {
                      return option.uuid;
                    }
                  }}
                  getOptionValue={(option) => option.uuid}
          />
                    <button id="addPath" className={styles.action} onClick={()=>this.context.model.pathlist.addPath("NewPath")}>
                        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                    </button>
        </span>
    )
  }
}
export default observer(PathSelect);
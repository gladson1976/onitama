import { useCallback } from 'react';
import classNames from 'classnames';
import { onitamaPacks } from './onitama.cards';
import './Onitama.module.scss';

function Onitama() {
  const appTitle = "Onitama";
  const appVersion = "1.0";
  const hintCount = 0;

  const goHint = useCallback(() => {
  }, []);

  const newOnitama = useCallback(() => {
  }, []);

  const showSettings = useCallback(() => {
  }, []);

  const showStats = useCallback(() => {
  }, []);

  const showHelp = useCallback(() => {
  }, []);

  const renderOnitamaHeader = useCallback(() => {
    return (
      <div className="onitama-title title-border">
        <table className="onitama-title">
          <tbody>
            <tr>
              <td className="title">
                <span>{appTitle}</span>
              </td>
              <td className="title text-right">
                <span className={classNames('material-icons', 'icon icon-hint', 'title-button',' cursor-pointer', {'hidden': hintCount === 0})} onClick={() => goHint()} />
                <span className="material-icons icon icon-replay title-button cursor-pointer" onClick={() => newOnitama()} />
                <span className="material-icons icon icon-settings title-button cursor-pointer" onClick={() => showSettings()}></span>
                <span className="material-icons icon icon-bar-chart title-button cursor-pointer" onClick={() => showStats()}></span>
                <span className="material-icons icon icon-question title-button cursor-pointer" onClick={() => showHelp()}></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }, [goHint, hintCount, newOnitama, showHelp, showSettings, showStats]);
 
  const renderCard = useCallback(() => {
    return (
      <>
        <div></div>
      </>
    );
  }, []);

  return (
    <>
      {renderOnitamaHeader()}
    </>
  );
}

export default Onitama;

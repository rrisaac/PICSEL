/* Description: An error page which informs users that the page they're trying visit is forbidden due to navigating features outside their priviledges.

@author Reynaldo R. Isaac Jr.
@date 04/04/2024
*/

const ErrorComponent = () => {
    const goBackHistory = () => {
        window.history.back(); // Default browser back button behavior
    };

    return (
        <>
            <div>
                <div>
                    <title>Dashboard | PICSEL</title>
                    <div className="page-description">
                    </div>
                </div>
                <div className="white-rectangle" style={{
                    borderRadius: 15,
                    marginLeft: 0,
                    marginRight: 8,
                    minHeight: 630
                }}>
                    <h1 >403 Forbidden</h1>
                    <h3 className="forbidden">403 Forbidden</h3>
                    <h1 className="forbidden-sub">You have no <b>permission</b> to use this feature.</h1>
                    <button className="btn btn-dark" onClick={goBackHistory} style={{marginTop: '30px'}}>Go back</button>
                </div>

            </div>
        </>
    );
}

export default ErrorComponent;
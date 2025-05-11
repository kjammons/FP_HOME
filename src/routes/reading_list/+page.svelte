<script></script>

<style>
    /* General page styling */
    body {
        font-family: 'Helvetica', sans-serif; /* Set font to Helvetica */
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
        color: #333;
    }

    /* Container for the reading list */
    .reading-list-container {
        max-width: 900px; /* Increased width for better readability */
        margin: 40px auto;
        padding: 30px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        font-family: 'Helvetica', sans-serif; /* Ensure container uses Helvetica */
    }

    /* Title styling */
    .reading-list-title {
        font-size: 2.5rem; /* Increased font size for better emphasis */
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
        color: #A91B0D; /* Changed title color to blue */
        font-family: 'Helvetica', sans-serif; /* Ensure title uses Helvetica */
    }

    /* Description styling */
    .reading-list-description {
        font-size: 1.2rem; /* Slightly larger font size for readability */
        margin-bottom: 30px;
        text-align: center;
        color: #555;
        font-family: 'Helvetica', sans-serif; /* Ensure description uses Helvetica */
    }

    /* List styling */
    ul {
        list-style: none;
        padding: 0;
        font-family: 'Helvetica', sans-serif; /* Ensure list uses Helvetica */
    }

    li {
        margin-bottom: 20px; /* Increased spacing between list items */
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #fdfdfd;
        transition: transform 0.2s, box-shadow 0.2s; /* Added hover animation */
        font-family: 'Helvetica', sans-serif; /* Ensure list items use Helvetica */
    }

    li:hover {
        transform: translateY(-5px); /* Slight lift on hover */
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* Added shadow on hover */
    }

    /* Link styling */
    a {
        color: #A91B0D; /* Updated link color */
        text-decoration: none;
        font-weight: bold;
        font-family: 'Helvetica', sans-serif; /* Ensure links use Helvetica */
    }

    a:hover {
        text-decoration: underline;
        color: #FF5733; /* Optional hover color for better interactivity */
    }

    /* Responsive design */
    @media (max-width: 600px) {
        .reading-list-container {
            padding: 20px;
        }

        .reading-list-title {
            font-size: 2rem;
        }

        .reading-list-description {
            font-size: 1rem;
        }

        li {
            padding: 10px;
        }

        a {
            font-size: 1rem;
        }
    }
</style>

<div class="reading-list-container">
    <h1 class="reading-list-title">Reading List</h1>
    <p class="reading-list-description">
        Explore these resources to learn more about housing discrimination, racial covenants, and the history of segregation in the United States.
    </p>

    <ul>
        <li>
            <a href="https://dspace.mit.edu/handle/1721.1/128260" target="_blank">
                Sociology, segregation, and the Fair Housing Act
            </a>
            – Steil and Charles (2020) explore how sociology and segregation relate to the Fair Housing Act in <em>Perspectives on Fair Housing</em>.
        </li>
        <li>
            <a href="https://www.huduser.gov/portal/sites/default/files/pdf/Federal-Housing-Administration-Underwriting-Manual.pdf" target="_blank">
                Federal Housing Administration Underwriting Manual
            </a>
            – U.S. Department of Housing and Urban Development (1938) outlines federal underwriting guidelines that institutionalized racial discrimination in housing.
        </li>
        <li>
            <a href="https://mappingprejudice.umn.edu/" target="_blank">
                Mapping Racial Covenants in the United States: A Technical Toolkit
            </a>
            – Mapping Prejudice (2024) provides a guide for identifying and mapping racial covenants nationwide.
        </li>
        <li>
            <a href="https://histecon.fas.harvard.edu/visualizing/buildingsuburbanpower/index.html" target="_blank">
                Building Suburban Power: The Business of Exclusionary Housing Markets, 1890–1960
            </a>
            – Harvard University (n.d.) presents a digital history project showing how exclusionary housing shaped suburban America.
        </li>
        <li>
            <a href="https://tile.loc.gov/storage-services/service/ll/usrep/usrep334/usrep334001/usrep334001.pdf" target="_blank">
                Shelley v. Kraemer, 334 U.S. 1 (1948)
            </a>
            – This landmark Supreme Court case ruled that courts could not enforce racial covenants in housing contracts.
        </li>
        <li>
            <a href="https://www.loc.gov/item/usrep163537/" target="_blank">
                Plessy v. Ferguson, 163 U.S. 537 (1896)
            </a>
            – The Supreme Court case that upheld "separate but equal" racial segregation laws until being overturned decades later.
        </li>
        <li>
            <a href="https://dsl.richmond.edu/panorama/redlining/" target="_blank">
                Redlining in New Deal America
            </a>
            – University of Richmond’s digital project visualizes how redlining practices took shape during the New Deal era.
        </li>
        <li>
            <a href="https://www.bostonfairhousing.org/timeline/index.html" target="_blank">
                Timeline of Housing Discrimination
            </a>
            – The Fair Housing Center of Greater Boston presents an online timeline tracing the history of housing discrimination in the region.
        </li>
        <li>
            <a href="https://www.mapc.org/resource-library/exclusionary-by-design/" target="_blank">
                Exclusionary by Design
            </a>
            – A report and video exploring how zoning was used as a tool of race and class exclusion in Boston’s suburbs from 1920 to today.
        </li>
        <li>
            <a href="https://www.bostonmagazine.com/news/2020/06/24/boston-segregation/" target="_blank">
                How Has Boston Gotten Away with Being Segregated for So Long?
            </a>
            – Boston Magazine examines the deep historical roots of racial segregation in Boston.
        </li>
        <li>
            <a href="https://www.npr.org/2017/05/03/526655831/a-forgotten-history-of-how-the-u-s-government-segregated-america" target="_blank">
                A ‘Forgotten History’ Of How The U.S. Government Segregated America
            </a>
            – NPR’s interview with Richard Rothstein about how federal housing policy enforced racial segregation, based on his book <em>The Color of Law</em>.
        </li>
    </ul>
</div>
/**
 * @description Format of the generated Approval Document
 * @author Aira Nicole Natividad
 * @date 04/29/2024
 */

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import montserratBold from '../assets/fonts/Montserrat-Bold.ttf';
import montserratRegular from '../assets/fonts/Montserrat-Regular.ttf';
import logo from '../assets/img/picsel_pdf_logo.jpg';
import location from '../assets/img/icons/location_icon.jpg';
import mail from '../assets/img/icons/mail_icon.jpg';
import phone from '../assets/img/icons/phone_icon.jpg';

Font.register({
  family: 'Montserrat',
  fonts: [
    { src: montserratBold, fontWeight: 'bold' },
    { src: montserratRegular, fontWeight: 'normal'}
  ],
});

// Define the styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 40,
    paddingHorizontal: 72, // 1 inch = 72 points
    fontFamily: 'Montserrat',
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: {
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    color: '#9C9C9C',
  },
  logo: {
    width: 115.2, // logo size
    height: 24.75, // logo size
    marginRight: 10, // Adjust spacing between logo and text
  },
  title: {
    paddingTop: 58,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paragraph: {
    paddingTop: 15,
    textIndent: 40, // First line indent
    textAlign: 'justify',
  },
  lineMargin: {
    marginBottom: 15,
  },
  alignToLeft: {
    textAlign: 'left',
  },
  section: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'justify',
  },
  row: {
    flexDirection: 'row',  // Aligns children components in a row
    justifyContent: 'space-between', 
    alignItems: 'top',
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'row',
  },
  detailLabel: {
    width: 120,
    marginRight: 10,
  },
  detailValue: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'left',
    fontSize: 12,
    paddingBottom: 36,
    paddingLeft: 72,
    color: '#9C9C9C',
  },
  footerText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftMarginFooter: {
    marginLeft: 25,
  },
  icons: {
    width: 15,
    height: 15,
    marginRight: 10,
  },
});

// Create the ApprovalDocument component
const ApprovalDocument = ({ data }) => {
  const fullName = (firstName, middleName, lastName) => {
    let full = '';
    if (firstName !== '___' && middleName !== '' && lastName !== '') {
      full = `${firstName} `;
      if (middleName !== 'N/A') {
        full += `${middleName} `;
      }
      full += lastName;
    } else {
      full = '_____________________________________';
    }
    return full;
  };

  const getOrdinalSuffix = (day) => {
    if (!day) return '';
    const j = day % 10,
          k = day % 100;
    if (j === 1 && k !== 11) {
      return day + 'st';
    }
    if (j === 2 && k !== 12) {
      return day + 'nd';
    }
    if (j === 3 && k !== 13) {
      return day + 'rd';
    }
    return day + 'th';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return time.toLocaleTimeString('en-US', options);
  };

  // render fetched attachments on separate pages
  const renderAttachments = () => {
    if (!data.attachmentUrls || data.attachmentUrls.length === 0) {
      return null;
    }
  
    return data.attachmentUrls.map((url, index) => (
      <Page key={index + 1} size="A4">
        <Image src={url} style={{ width: '100%', height: 'auto' }} />
      </Page>
    ));
  };
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <Text style={styles.alignToLeft}>PICSEL (Platform for Institute of Computer Science{"\n"}Events, Scheduling, and Logistics)</Text>
        </View>

        <View style={styles.title}>
          <Text>APPROVAL DOCUMENT</Text>
        </View>

        <View>
          <Text style={styles.paragraph}>This is to certify that the details below were confirmed as accurate and the reservation was approved as specified, upon the request made by {fullName(data.firstName, data.middleName, data.lastName)}.</Text>
        </View>

        <View>
          <Text style={[styles.paragraph, styles.lineMargin]}>The details of the reservation are as follows:</Text>
        </View>

        <View style={styles.section}>
          <View style={[styles.detailsContainer, styles.lineMargin]}>
            <Text style={styles.detailLabel}>Reservation ID:</Text>
            <Text style={styles.detailValue}>{data.requestId}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailLabel}>Room:</Text>
            <Text style={styles.detailValue}>{data.roomName}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailLabel}>Title:</Text>
            <Text style={styles.detailValue}>{data.title}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailLabel}>Purpose:</Text>
            <Text style={styles.detailValue}>{data.purpose}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{formatDate(data.date)}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailLabel}>Start-End Time:</Text>
            <Text style={styles.detailValue}>{formatTime(data.startTime)} - {formatTime(data.endTime)}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.paragraph}>Issued this {getOrdinalSuffix(data.day)} day of {data.month}, {data.year} for operational and documentation purposes.</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerText}>
            <Image style={styles.icons} src={location} />
            <Text>Institute of Computer Science</Text>
          </View>
          <Text style={styles.leftMarginFooter}>College of Arts and Sciences, UPLB</Text>
          <Text style={styles.leftMarginFooter}>Los Baños Laguna, Philippines 4031</Text>
          <View style={styles.footerText}>
            <Image style={styles.icons} src={phone} />
            <Text>Phone: (049) 536 2302 | 63-49-536-2302</Text>
          </View>
          <View style={styles.footerText}>
            <Image style={styles.icons} src={mail} />
            <Text>Email: ics.uplb@up.edu.ph</Text>
          </View>
        </View>
      </Page>
      {renderAttachments()}
    </Document>
  );
};

export default ApprovalDocument;

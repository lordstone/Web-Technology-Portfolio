package edu.usc.cs_server.chengxis.homework9;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.Spinner;
import android.widget.TextView;

public class forecast extends AppCompatActivity {

    public boolean testAllInputs(EditText text_street, EditText text_city, Spinner spinner_state, TextView label_error){
        String Error_Message = "";
        if(text_street.getText().toString().trim().equals("")){
            Error_Message = "Please enter a Street Address";
            label_error.setText(Error_Message);
            return false;
        }
        if(text_city.getText().toString().trim().equals("")){
            Error_Message = "Please enter a City name";
            label_error.setText(Error_Message);
            return false;
        }
        if(spinner_state.getSelectedItem().toString().equals("Select")) {
            Error_Message = "Please select a State";
            label_error.setText(Error_Message);
            return false;
        }
        return true;
    }//test all inputs


    @Override
    protected void onCreate(Bundle savedInstanceState) {




        //start setting up all functions

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forecast);

        final Button button_clear = (Button) findViewById(R.id.button_reset);
        final Button button_search = (Button) findViewById(R.id.button_submit);
        final Button button_about = (Button) findViewById(R.id.button_about);
        final EditText text_street = (EditText) findViewById(R.id.editText_street);
        final EditText text_city = (EditText) findViewById(R.id.editText_city);
        final Spinner spinner_state = (Spinner) findViewById(R.id.spinner_state);
        final RadioButton radio_fahrenheit = (RadioButton) findViewById(R.id.radioButton_fahrenheit);
        final RadioButton radio_celsius = (RadioButton) findViewById(R.id.radioButton_celsius);
        final TextView label_error = (TextView) findViewById(R.id.textView_error);

        button_clear.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                // Perform action on click
                text_city.setText("");
                text_street.setText("");
                spinner_state.setSelection(0);
                radio_fahrenheit.setChecked(true);
                radio_celsius.setChecked(false);
                label_error.setText("");
            }
        });


        button_search.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                // Perform action on click
                if(testAllInputs(text_street, text_city, spinner_state, label_error)){
                    nishiSB(v);
                }

            }
        });

        button_about.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                // Perform action on click
                Intent about_intent = new Intent(v.getContext(), AboutActivity.class);
                forecast.this.startActivity(about_intent);

            }
        });

        //End of setting up all functions

    }




    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_forecast, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    public void msbox(String str,String str2)
    {
        AlertDialog.Builder dlgAlert  = new AlertDialog.Builder(this);
        dlgAlert.setTitle(str);
        dlgAlert.setMessage(str2);
        dlgAlert.setPositiveButton("OK",new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int whichButton) {
                finish();
            }
        });
        dlgAlert.setCancelable(true);
        dlgAlert.create().show();
    }


    public void nishiSB(View view) {
        msbox("SBSB!","Ni Shi SB!");
    }
}
